import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

export async function sendEmail(emailData) {
    try {
        let emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = process.env.SEND_IN_BLUE ?? null;
        let currency = emailData.get('currency');
        console.log(emailData.get('currency'));
        console.log(emailData.get('total'));
        let message = new SendSmtpEmail();
        message.subject = "Thank you for registering at WRT2026!";
        message.params = {
            author: emailData.get('author'),
            co_authors: emailData.get('co_authors'),
            insitution: emailData.get('insitution'),
            topic: emailData.get('topic'),
            p_type: emailData.get('p_type'),
            abstract_title: emailData.get('abstract_title'),
            total: emailData.get('total')
        };
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = [{ email: emailData.get('email'), name: emailData.get('author') }];
        {currency === 'uah' ? message.templateId = 22 : message.templateId = 21}
        emailAPI.sendTransacEmail(message).then(res => {
            console.log(currency);
            console.log(message.templateId);
            console.log(JSON.stringify(res.body));
        }).catch(err => {
            console.error("Error sending email:", err);
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}