import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

export async function sendEmail(emailData) {
    try {
        let emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = "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";
        let message = new SendSmtpEmail();
        message.subject = "Thank you for registering at WRT2026!";
        message.params = emailData;
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = [{ email: emailData.email, name: emailData.author }];
        message.templateId = 21;
        emailAPI.sendTransacEmail(message).then(res => {
            console.log(JSON.stringify(res.body));
        }).catch(err => {
            console.error("Error sending email:", err.body);
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}