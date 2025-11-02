import { data } from "react-router";
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import fs from "fs";

const prisma = new PrismaClient();
export async function getRefreshToken() {
    const code = "1000.8b8d84a6ef8a23d705beb22fed74310a.bcbdea646d6075fc9213991318f9e613";
    const body = new URLSearchParams({
        code: code,
        client_id: '1000.63SYKDL1M44EWKB3LF2K1017OAAZOZ',
        client_secret: "36d5de3beaa8fb14100384d58caafae5e65481377f",
        grant_type: "authorization_code",
        redirect_uri: "https://wrt2026.com.ua",
    });
    try {
        const data = await axios.post(
            'https://accounts.zoho.com/oauth/v2/token',
            body.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        await prisma.Zohotoken.create({
            data: {
                code: code,
                access_token: data?.data?.access_token,
                refresh_token: data?.data?.refresh_token,
                scope: "ZohoInvoice.invoices.CREATE,ZohoInvoice.invoices.READ,ZohoInvoice.invoices.UPDATE,ZohoInvoice.invoices.DELETE,ZohoInvoice.contacts.CREATE,ZohoInvoice.contacts.EDIT"
            }
        })

    } catch (error) {
        return ({errors: error});
    }

}
async function updateAccessToken() {
    const getToken = await prisma.zohotoken.findFirst({
        orderBy: { id: "desc" },
    });
    const body = new URLSearchParams({
        refresh_token: getToken.refresh_token,
        client_id: '1000.63SYKDL1M44EWKB3LF2K1017OAAZOZ',
        client_secret: "36d5de3beaa8fb14100384d58caafae5e65481377f",
        grant_type: "refresh_token",
    });
    try {
        const data = await axios.post(
            'https://accounts.zoho.com/oauth/v2/token',
            body.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        await prisma.Zohotoken.update({
           where: {
               id: getToken.id,
           },
            data: {
               access_token: data?.data?.access_token
            }
        })
        return data?.data?.access_token;
    } catch (error) {
        return ({errors: error});
    }
}

async function createCurrency(token, API_BASE) {
    const organizationId = "902053247";
    const currency = {
        "currency_code": "UAH",
        "currency_symbol": "UAH",
        "price_precision": 2,
        "currency_format": "1,234,567.89"
    }
    try {
        const {data} = await axios.post(
            `${API_BASE}/invoice/v3/settings/currencies`,
            {currency},
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                    "Content-type": "application/json",
                }
            }
        );
        console.log("Create Currency:", data)
        //return data?.code;
    } catch (error) {
        console.log("Create Currency error", error.response.data)
        return ({errors: error});
    }
}

export async function createInvoice(formData, registrationId) {
    const API_BASE = `https://www.zohoapis.com`;
    const organizationId = "902053247";
    const token = await checkAccessToken();
    const customer = await getZohoCustomer(formData, token);
    const item = await createLineItem(formData, token, registrationId);
    const currency = formData.get('currency');
    let notes = '';
    if (currency == 'uah') {
        notes = "Найменування одержувача: ГО ВІРТУС\n" +
            "Код отримувача: 41159230\n" +
            "Назва банку: АТ КБ «ПриватБанк»\n" +
            "Рахунок одержувача у форматі IBAN: UA223052990000026000016803603\n" +
            "Валюта: UAH";
    } else {
        notes = "Payment details:\n" +
            "Company Name: ГО ВІРТУС\n" +
            "IBAN Code: UA343052990000026007016802276\n" +
            "Name of the bank: JSC CB \"PRIVATBANK\", 1D HRUSHEVSKOHO STR., KYIV, 01001, UKRAINE\n" +
            "Bank SWIFT Code: PBANUA2X\n" +
            "Company address: 03150, УКРАЇНА, М. КИЇВ, ВУЛ. КАЗИМИРА МАЛЕВИЧА, Б. 11, КВ. 906.\n" +
            "\n" +
            "Correspondent banks\n" +
            "Account in the correspondent bank: 400886700401 \n" +
            "SWIFT Code of the correspondent bank: COBADEFF\n" +
            "Correspondent bank: Commerzbank AG, Frankfurt am Main, Germany\n" +
            "\n" +
            "Account in the correspondent bank: 6231605145\n" +
            "SWIFT Code of the correspondent bank: CHASDEFX\n" +
            "Correspondent bank: J.P.MORGAN AG, FRANKFURT AM MAIN, GERMANY\n" +
            "\n" +
            "Account in the correspondent bank: 5184099710, IBAN DE39503303005184099710\n" +
            "SWIFT Code of the correspondent bank: IRVTDEFX\n" +
            "Correspondent bank: THE BANK OF NEW YORK MELLON, FRANKFURT AM MAIN\n" +
            "\n" +
            "Account in the correspondent bank: 0042997188, IBAN IE96CITI99005142997188\n" +
            "SWIFT Code of the correspondent bank: CITIIE2X\n" +
            "Correspondent bank: CITIBANK EUROPE PLC\n" +
            "\n" +
            "Remittance information\n" +
            "Payment form\n" +
            "Description of services: Information and consultative service for Roman Selin in the frame of the VIII International conference WRT 2026, 5-9 October 2026\n" +
            "Document number and dates (contract/invoice/offer, etc.)"
    }
    const payload = {
        customer_id: customer,
        date: new Date().toISOString().split("T")[0],
        line_items: [
            { item_id: item.item_id, quantity: 1, rate: item.rate, description: item.description },
        ],
        notes: notes,
    };
    try {
        const {data} = await axios.post(
            `${API_BASE}/invoice/v3/invoices`,
            payload,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                    "Content-Type": "application/json"
                }
            }
        );
        const invoice_url = data?.invoice?.invoice_url;
        const invoice_id = data?.invoice?.invoice_id;
        await prisma.zohocontacts.update({
            where: {
                email: formData.get("email"),
            },
            data: {
                invoiceUrl: invoice_id
            }
        })
        await prisma.registration.update({
            where: {
                id: registrationId,
                email: formData.get("email"),
            },
            data: {
                invoiceUrl: invoice_id
            }
        })
        const getPdf = await getPDF(data?.invoice?.invoice_id, token, API_BASE)
        return {
            ok: true,
        }
    } catch (error) {
        return ({errors: error});
    }

}

async function checkAccessToken() {
    const getToken = await prisma.zohotoken.findFirst({
        orderBy: { id: "desc" },
    });
    const accessToken = getToken.access_token;
    try {
        const res = await axios.get('https://www.zohoapis.eu/invoice/v3/organizations', {
            headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`
            }
        });
        return data [{
            ok: true,
            accessToken: accessToken
        }];
    } catch (err) {
        if (err.response?.status === 401) {
            const updateToken = await updateAccessToken();
            return updateToken;
        } else {
            console.error("Unexpected error:", err.message);
            return data [{
                ok: false
            }];
        }

    }
}

async function getZohoCustomer(formData, token) {
    try {
        const author = await prisma.Zohocontacts.findFirst({
            where: {
                email: formData.get("email")
            }
        });
        return author.zohoId;
    } catch (error) {
        console.log("Customer not found")
        try {
            const createAuthour = await createZohoCustomer(formData, token);
            return createAuthour;
        } catch (error) {
        }
    }
}

async function createZohoCustomer(formData, token) {
    const API_BASE = `https://www.zohoapis.com`;
    const organizationId = "902053247";
    const name = formData.get("author").split(" ");

    //const token = await checkAccessToken();
    const customer = {
        contact_name: formData.get("author"),
        company_name: formData.get("insitution"),
        contact_persons: [
            {
                first_name: name[0],
                last_name: name[1],
                email: formData.get("email")
            }
        ]
    };
    try {
        const {data} = await axios.post(
            `${API_BASE}/invoice/v3/contacts`,
            customer,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                    "Content-Type": "application/json"
                }
            }
        );
        await prisma.zohocontacts.create({
            data: {
                name: data?.contact?.contact_name,
                email: data?.contact?.email,
                zohoId: data?.contact.contact_id,
            }
        })
        return data.contact.contact_id;
    } catch (error) {
        return ({errors: error});
    }
}

async function createLineItem(formData, token, registrationId) {
    const API_BASE = `https://www.zohoapis.com`;
    const organizationId = "902053247";
    const name = formData.get("author").split(" ");
    const item = {
        name: "WRT 2026 Registration (" + formData.get("author") + ", Id: " + registrationId + ")",
        rate: formData.get('total').replace(/[^0-9.]/g, ''),
        description: formData.get("author") + 'registration (payment in ' + formData.get("currency").toUpperCase() + ')',
        product_type: "service",
    }
    try {
        const {data} = await axios.post(
            `${API_BASE}/invoice/v3/items`,
            item,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                    "Content-Type": "application/json"
                }
            }
        );
        const item_id = data?.item?.item_id;

        await prisma.zohocontacts.update({
            where: {
                email: formData.get("email"),
            },
            data: {
                registrationItemId: item_id
            }
        })
        return data?.item;
    } catch (error) {
        console.log("Item create error", error.response.data)
        return ({errors: error});
    }
}

async function markAsSent(invoice_id, token, API_BASE) {
    const organizationId = "902053247";
    console.log(token)
    console.log(`${API_BASE}/invoice/v3/invoices/${invoice_id}/status/sent`)
    try {
        const {data} = await axios.post(
            `${API_BASE}/invoice/v3/invoices/${invoice_id}/status/sent`,
            {},
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                }
            }
        );
        //console.log("Mark as sent:", data)
        await getPDF(invoice_id, token, API_BASE);
        //return data?.code;
    } catch (error) {
        console.log("markAsSent error", error.response.data)
        return ({errors: error});
    }
}

async function getPDF(invoice_id, token, API_BASE) {
    const organizationId = "902053247";
    const savePath = `/home/admin/domains/wrt2026.com.ua/public_html/public/invoices/invoice-${invoice_id}.pdf`;
    const query = {
        print: true,
        accept: "pdf"
    }
    try {
        const {data} = await axios.get(
            `${API_BASE}/invoice/v3/invoices/${invoice_id}?accept=pdf&print=false`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    "X-com-zoho-invoice-organizationid": organizationId,
                    Accept: "application/pdf",
                },
                responseType: "arraybuffer",
            }
        );
        try {
            fs.writeFileSync(savePath, data);
        } catch (error) {
            console.log("Saving error", error)
        }
        return true;
    } catch (error) {
        console.log("getPDF error", error.response.data)
        return ({errors: error});
    }
}

