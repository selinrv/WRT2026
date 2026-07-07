import { google } from "googleapis";
import { data } from "react-router";
import path from "path";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function SaveToTable(formData, registrationId) {
    const documentId = '1YGvWaxqr3cYkXX8-zsPlkivNDQoYzcVKAfQ5hHLIfdk';
    const keyPath = path.join(process.cwd(), "assets/files/wrt2026-ec853efd581d.json");

    const auth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });


    const author = formData.get('author');
    const email = formData.get('email');
    const title = formData.get('abstract_title');
    const co_authors = formData.get('co_authors');
    const institution = formData.get('institutions');
    const category = formData.get('selected_category');
    const topic = formData.get('topic');
    const presentation_type = formData.get('p_type');
    const currency = formData.get('currency');
    const orcidId = formData.get('orcidId');
    const getInvouceUrl = await prisma.registration.findFirst({
        where: {
            id: registrationId,
            email: email
        },
        orderBy: { id: "desc" },
    });
    const invoiceUrl = `https://wrt2026.com.ua/invoices/invoice-${getInvouceUrl.invoiceUrl}.pdf`;
    const date = new Date().toISOString();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheet = (await sheets.spreadsheets.get({spreadsheetId: documentId, fields: 'sheets(properties.title)'})).data;

    const request = [
        {
            addSheet: {
                properties: {
                    title: 'test',
                },
            },
        },
    ];





    try {
        const r = await sheets.spreadsheets.values.append({
            spreadsheetId: documentId,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[author, email, co_authors, institution, category, topic, presentation_type, title, currency, orcidId, invoiceUrl, date]],
            },
        });

        return r;
    } catch(e) {
        console.log(e)
    }
}