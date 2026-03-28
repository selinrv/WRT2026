import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import { data } from "react-router";

export async function action({ request }) {
    const formData = await request.formData();
    try {
        let emailAPI = new TransactionalEmailsApi();
        emailAPI.authentications.apiKey.apiKey = process.env.SEND_IN_BLUE ?? null;
        let message = new SendSmtpEmail();
        message.subject = "WRT2026 Contact form message";
        message.sender = { name: "WRT2026 Office", email: "office@wrt2026.com.ua" };
        message.to = [{ email: "office@wrt2026.com.ua", name: "WRT2026 Support"}];
        message.templateId = 30;
        message.params = {
            name: formData.get("name"),
            email: formData.get('email'),
            message: formData.get('message'),
        };
        await emailAPI.sendTransacEmail(message);
        return { success: true };
    } catch (error) {
        console.log("Error sending Brevo message:", error);
        return null;
    }

}

export default function Contact() {
    return null; // no UI needed, just handles the action
}