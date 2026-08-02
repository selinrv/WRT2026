import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import { PrismaClient } from '@prisma/client';
import { PAPER_STATUSES } from "./paper-status.js";
const prisma = new PrismaClient();

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Same escaping, but keeps the line breaks an admin typed into a textarea —
// raw newlines collapse to a single space in HTML.
function escapeMultiline(value) {
    return escapeHtml(value).replace(/\r?\n/g, "<br />");
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

// ---------------------------------------------------------------------------
// Paper status change notifications
// ---------------------------------------------------------------------------

const [
    STATUS_UPLOADED,
    STATUS_IN_REVIEW,
    STATUS_ACCEPTED,
    STATUS_CORRECTIONS,
    STATUS_DECLINED,
] = PAPER_STATUSES;


const STATUS_EMAILS = {
    [STATUS_UPLOADED]: {
        subject: "Your paper has been uploaded",
        body: (paper) => `
            <p>Dear ${escapeHtml(paper.author)},</p>
            <p>Your paper has been uploaded and we will start review process shortly!</p>
            <p>Thank you for participating in our conference!</p>
        `,
    },

    [STATUS_IN_REVIEW]: {
        subject: "Your WRT2026 paper review has started",
        body: (paper) => `
            <p>Dear ${escapeHtml(paper.author)},</p>
            <p>We would like to inform you, that the review of your WRT2026 manuscript has been started.</p>
            <p>You will be notified of the results in the coming days.</p>
        `,
    },

    [STATUS_ACCEPTED]: {
        subject: "Your WRT2026 paper has been accepted",
        body: (paper) => `
            <p>Dear ${escapeHtml(paper.author)},</p>
            <p>Congratulations! Your WRT2026 manuscript has been accepted!</p>
            <p>Looking forward to seeing you at our conference! </p>
        `,
    },

    [STATUS_CORRECTIONS]: {
        subject: "Your WRT2026 paper requires corrections",
        body: (paper) => `
            <p>Dear ${escapeHtml(paper.author)},</p>
            <p>Your WRT2026 manuscript requires corrections before the review can continue.</p>
            ${paper.notes
                ? `<p style="margin-bottom:8px;"><strong>Requested corrections:</strong></p>
                   <div style="background:#fff8eb;border-left:3px solid #f5b544;border-radius:4px;padding:14px 18px;color:#4b3a17;">
                       ${escapeMultiline(paper.notes)}
                   </div>`
                : `<p>Our office will contact you shortly with the details.</p>`}
            <p>Please send the corrected manuscript to
               <a href="mailto:office@wrt2026.com.ua" style="color:#1c63ff;">office@wrt2026.com.ua</a>,
               or reply to this email if you have any questions.</p>
        `,
    },

    [STATUS_DECLINED]: {
        subject: "Your WRT2026 paper has been declined",
        body: (paper) => `
            <p>Dear ${escapeHtml(paper.author)},</p>
            <p>Your WRT2026 paper has been declined by our reviewers team.</p>
            ${paper.notes
            ? `<p style="margin-bottom:8px;"><strong>Reasons for declining manuscript:</strong></p>
                   <div style="background:#fff8eb;border-left:3px solid #f5b544;border-radius:4px;padding:14px 18px;color:#4b3a17;">
                       ${escapeMultiline(paper.notes)}
                   </div>`
            : `<p>Our office will contact you shortly with the details.</p>`}
            <p>You can rewrite your manuscript and start the upload process from the scratch.</p>
            <p>Thank you for understanding!</p>
        `,
    },
};


function statusEmailHtml(paper, body) {
    return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#374151;font-size:15px;line-height:1.6;">
        ${body}
     
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 14px;" />
        <p style="color:#9aa3b2;font-size:13px;margin:0;">
            Paper: ${escapeHtml(paper.paper_title)}<br />
            WRT2026 &mdash; Welding and Related Technologies Conference, Uzhhorod, Ukraine
        </p>
    </div>`;
}

// Emails the main (submitting) author that their paper changed state. The
// caller is expected to have saved the new status already — this only notifies.
export async function sendPaperStatusEmail(paper) {
    const template = STATUS_EMAILS[paper.status];
    if (!template) {
        console.log(`No status email configured for "${paper.status}" — skipping notification.`);
        return false;
    }

    if (!paper.email) {
        console.warn(`Paper ${paper.id} has no author email — skipping status notification.`);
        return false;
    }

    try {
        const emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = process.env.SEND_IN_BLUE ?? null;

        const message = new SendSmtpEmail();
        message.subject = template.subject;
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = [{ email: paper.email, name: paper.author }];
        message.replyTo = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.htmlContent = statusEmailHtml(paper, template.body(paper));

        const res = await emailAPI.sendTransacEmail(message);
        console.log(`Status email sent to ${paper.email} for paper ${paper.id}:`, JSON.stringify(res.body ?? res));
        return true;
    } catch (error) {
        console.error(`Error sending status email for paper ${paper.id}:`, error);
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
            // The free "Online" category (value = 1) always has a zero total.
            total: emailData.get('category') === '1' ? 0 : emailData.get('total'),
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