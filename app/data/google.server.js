import { google } from "googleapis";
import { data } from "react-router";
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
    const institution = formData.get('institutions');
    const orcidId = formData.get('orcidId');
    const abstract = formData.get('abstract');
    const docs = google.docs({ version: "v1", auth });

    // Parse the co-authors JSON produced by the registration form. Falls back to
    // an empty list if the value is missing or malformed.
    let coAuthorsList = [];
    try {
        const parsed = JSON.parse(co_authors || "[]");
        if (Array.isArray(parsed)) coAuthorsList = parsed;
    } catch (e) {
        coAuthorsList = [];
    }

    // One line per author, formatted "Name, Organization, ORCID". The main
    // author comes first, then each co-author on its own line.
    const formatPerson = (name, organization, orcid) =>
        [name, organization, orcid].map((v) => (v || "").trim()).filter(Boolean).join(", ");

    const authorLines = [
        formatPerson(author, institution, orcidId),
        ...coAuthorsList.map((ca) => formatPerson(ca.name, ca.organization, ca.orcidId)),
    ].filter(Boolean);
    const authorsBlock = authorLines.join("\n");

    // Insert the whole entry at the top of the document in a single request so
    // the style ranges below can use stable, 1-based indices.
    const fullText = `${title}\n\n${authorsBlock}\n\n${abstract}\n`;
    const authorsStart = title.length + 3;                 // after "<title>\n\n"
    const authorsEnd = authorsStart + authorsBlock.length;
    const abstractStart = authorsEnd + 2;                  // after "<authors>\n\n"
    const abstractEnd = abstractStart + abstract.length;

    try {
        await docs.documents.batchUpdate({
            documentId,
            requestBody: {
                requests: [
                    {insertText: {location: {index: 1}, text: fullText}},
                    {
                        updateParagraphStyle: {
                            range: {startIndex: 1, endIndex: title.length + 1},
                            paragraphStyle: {namedStyleType: "HEADING_1"},
                            fields: "namedStyleType",
                        }
                    },
                    {
                        updateParagraphStyle: {
                            range: {startIndex: authorsStart, endIndex: authorsEnd},
                            paragraphStyle: {namedStyleType: "HEADING_3"},
                            fields: "namedStyleType",
                        }
                    },
                    {
                        updateTextStyle: {
                            range: {startIndex: authorsStart, endIndex: authorsEnd},
                            textStyle: {bold: true},
                            fields: "bold",
                        }
                    },
                    {
                        updateParagraphStyle: {
                            range: {startIndex: abstractStart, endIndex: abstractEnd},
                            paragraphStyle: {namedStyleType: "NORMAL_TEXT"},
                            fields: "namedStyleType",
                        }
                    },
                    {
                        updateTextStyle: {
                            range: {startIndex: abstractStart, endIndex: abstractEnd},
                            textStyle: {
                                bold: false,
                                underline: false,
                                fontSize: {magnitude: 12, unit: "PT"},
                            },
                            fields: "bold,underline,fontSize",
                        }
                    },
                    {insertPageBreak: {location: {index: abstractEnd + 1}}},
                ],
            },
        });
        return data({
            ok: true
        })
    } catch (error) {
        console.log(error);
        return data({
            ok: false
        })
    }



}