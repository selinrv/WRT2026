import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// The registration form stores co-authors as a JSON array of
// { name, organization, orcidId }. Render it as a human-readable string:
// "Name, Organization, ORCID; Name, Organization, ORCID".
function formatCoAuthors(raw) {
    let list = [];
    try {
        const parsed = JSON.parse(raw || "[]");
        if (Array.isArray(parsed)) list = parsed;
    } catch (e) {
        list = [];
    }
    return list
        .map((ca) =>
            [ca.name, ca.organization, ca.orcidId]
                .map((v) => (v || "").trim())
                .filter(Boolean)
                .join(", ")
        )
        .filter(Boolean)
        .join("; ");
}

function paperUploadHtml(paper) {
    const row = (label, value) =>
        `<tr>
            <td style="padding:8px 14px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:8px 14px;color:#111827;font-size:15px;">${value}</td>
        </tr>`;
    const link = (href) =>
        href ? `<a href="${escapeHtml(href)}" style="color:#1c63ff;">${escapeHtml(href)}</a>` : "&mdash;";
    return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="color:#111827;">New paper submitted to WRT2026</h2>
        <p style="color:#374151;">A new manuscript has been uploaded through the paper submission form.</p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            ${row("Paper title", escapeHtml(paper.paper_title))}
            ${row("Author", escapeHtml(paper.author))}
            ${row("Author email", `<a href="mailto:${escapeHtml(paper.email)}" style="color:#1c63ff;">${escapeHtml(paper.email)}</a>`)}
            ${row("Co-authors", escapeHtml(paper.co_authors) || "&mdash;")}
            ${row("Organization", escapeHtml(paper.organization) || "&mdash;")}
            ${row("Status", escapeHtml(paper.status))}
            ${row("Manuscript", link(paper.manuscript_link))}
            ${row("Signed license", link(paper.license_link))}
            ${row("Submitted", escapeHtml(new Date().toUTCString()))}
        </table>
    </div>`;
}

// Notifies the fixed conference addresses (from PAPER_NOTIFY_EMAILS, a
// comma-separated list) whenever a paper is uploaded successfully.
export async function sendPaperUploadEmail(paper) {
    const recipients = (process.env.PAPER_NOTIFY_EMAILS || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

    if (recipients.length === 0) {
        console.warn("PAPER_NOTIFY_EMAILS is not set — skipping paper upload notification.");
        return;
    }

    try {
        const emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = process.env.SEND_IN_BLUE ?? null;

        const message = new SendSmtpEmail();
        message.subject = `New paper submitted: ${paper.paper_title}`;
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = recipients.map((email) => ({ email }));
        message.replyTo = { email: paper.email, name: paper.author };
        message.htmlContent = paperUploadHtml(paper);

        const res = await emailAPI.sendTransacEmail(message);
        console.log("Paper upload notification sent:", JSON.stringify(res.body ?? res));
    } catch (error) {
        console.error("Error sending paper upload notification:", error);
        throw error;
    }
}

export async function sendEmail(emailData, registrationId, plainPassword) {
    const getInvouceUrl = await prisma.registration.findFirst({
        where: {
            id: registrationId,
            email: emailData.get('email')
        },
        orderBy: { id: "desc" },
    });
    const invoiceUrl = `https://wrt2026.com.ua/invoices/invoice-${getInvouceUrl.invoiceUrl}.pdf`;
    try {
        let emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = process.env.SEND_IN_BLUE ?? null;
        let currency = emailData.get('currency');
        let message = new SendSmtpEmail();
        message.subject = "Thank you for registering at WRT2026!";
        let category;
        message.params = {
            id: getInvouceUrl.id,
            author: emailData.get('author'),
            co_authors: formatCoAuthors(emailData.get('co_authors')),
            insitution: emailData.get('institutions'),
            category: emailData.get('selected_category'),
            topic: emailData.get('topic'),

            
            p_type: emailData.get('p_type'),
            abstract_title: emailData.get('abstract_title'),
            total: emailData.get('total'),
            password: plainPassword,
            invoiceId: getInvouceUrl.invoiceUrl,
            invoiceUrl: invoiceUrl,
            voucher: 'WRT2026'
        };
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = [{ email: emailData.get('email'), name: emailData.get('author') }];
        {currency === 'uah' ? message.templateId = 22 : message.templateId = 21}
        emailAPI.sendTransacEmail(message).then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.error("Error sending email:", err);
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}