import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function sendEmail(emailData, registrationId) {
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
        message.params = {
            id: getInvouceUrl.id,
            author: emailData.get('author'),
            co_authors: emailData.get('co_authors'),
            insitution: emailData.get('institutions'),
            category: emailData.get('category'),
            topic: emailData.get('topic'),
            p_type: emailData.get('p_type'),
            abstract_title: emailData.get('abstract_title'),
            total: emailData.get('total'),
            invoiceId: getInvouceUrl.invoiceUrl,
            invoiceUrl: invoiceUrl
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