import { google } from "googleapis";
import path from "path";

export async function AddToDoc(formData) {
    const documentId = "1FUPtrQBObKInPAzGF-WijgwWxkiGDMDskIumvO50pJE";
    const keyPath = path.join(process.cwd(), "assets/files/wrt2026-ec853efd581d.json");

    const auth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: ["https://www.googleapis.com/auth/documents"],
    });
    const title = formData.get('abstract_title');
    const author = formData.get('author');
    const co_authors = formData.get('co_authors');
    const institution = formData.get('insitution');
    const abstract = formData.get('abstract');
    const docs = google.docs({ version: "v1", auth });
    const institutions_index = title.length + author.length + co_authors.length + 5;
    const abstract_index = institutions_index + institution.length;
    const post_abstract_index = abstract_index + abstract.length + 10;
    console.log(title.length);
    console.log(abstract_index);
    console.log(abstract_index);
    console.log(post_abstract_index);
    await docs.documents.batchUpdate({
        documentId,
        requestBody: {
            requests: [
                { insertText: { location: { index: 1 }, text: title + "\n" } },
                { insertText: { location: { index: title.length + 1}, text: "\n" } },
                { updateParagraphStyle: {
                    range: { startIndex: 1, endIndex: title.length },
                    paragraphStyle: { namedStyleType: "HEADING_1" },
                    fields: "namedStyleType",
                }},
                { insertText: { location: { index: title.length + 2 }, text: author + ", " + co_authors} },
                { updateParagraphStyle: {
                        range: { startIndex: title.length + 2, endIndex: institutions_index + 1 },
                        paragraphStyle: { namedStyleType: "HEADING_3" },
                        fields: "namedStyleType",
                    }},
                {  updateTextStyle: {
                        range: { startIndex: title.length + 2, endIndex: institutions_index },
                        textStyle: { bold: true },
                        fields: "bold",
                }},
                {  updateTextStyle: {
                        range: { startIndex: institutions_index, endIndex: institutions_index + 1 },
                        textStyle: { underline: true },
                        fields: "underline",
                    }},
                { insertText: { location: { index: institutions_index}, text: institution + "\n\n"} },
                {  updateTextStyle: {
                        range: { startIndex: abstract_index, endIndex: abstract_index + 2 },
                        textStyle: {
                            bold: false,
                            underline: false,
                            fontSize: { magnitude: 12, unit: "PT" },
                        },
                        fields: "bold,underline,fontSize",
                    }},
                { insertText: { location: { index: abstract_index + 1}, text: abstract + "\n"} },
                { insertPageBreak: { location: { index: abstract_index + abstract.length + 2} } },
            ],
        },
    });

}