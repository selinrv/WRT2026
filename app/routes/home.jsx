import Homeslider from "../components/homeslider";
import Topics from "../components/topics";
import Slider from "../components/slider";
import Past from "../components/pastconference";
import RegistrationForm from "../components/registration";
import Venue from "../components/venus";



export function meta() {
  return [
    { title: "WRT2026 Conference - Uzhhorod, Ukraine" },
    { name: "description", content: "WRT2026 - Welding and Related Technologies Conference 2026, organized by the E.O.Paton Electric Welding Institute of the National Academy of Sciences of Ukraine" },
  ];
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addRegistation(formData) {
    return await prisma.registration.create({
        data: {
            author: formData.get('author'),
            co_authors: formData.get('co_authors'),
            abstract_title: formData.get('abstract_title'),
            abstract: formData.get('abstract'),
            institutions: formData.get('institutions'),
            type: formData.get('p_type'),
            reg_category: formData.get('category'),
            topic: formData.get('topic'),
            email: formData.get('email'),
            paid: false
        },
        select: { id: true }
    });
}

export async function action({ request }) {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);
    const { validateInput } = await import("../data/validation.server");
    const { createInvoice } = await import("../data/zoho.server");
    const { sendEmail } = await import("../data/email.server");
    const { AddToDoc } = await import("../data/google.server");

    let docStatus;
    let invoiceStatus;
    let emailStatus;
    let registrationId;

    try {
            console.log("starting validation")
            validateInput(Object.fromEntries(formData))
        } catch (error) {
            console.log("Validation errors", error)
            return { errors: error };
        }

        try {
            console.log("Starting registration");
            const getId = await addRegistation(formData);
            registrationId = getId.id;
            console.log("registrationId", getId.id);
        } catch (error) {
            console.log("Registraation error", error);
            return { errors: error };
        }

        try {
            const doc = await AddToDoc(formData);
            console.log("Doc Status", doc)
            docStatus = doc;

        } catch (error) {
            console.log("Document error", error)
            return false;
        }

        try {
            if (docStatus?.data.ok) {
                console.log("Starting creating invoice");
                const invoice = await createInvoice(formData, registrationId);
                console.log("invoiceStatus", invoice)
                invoiceStatus = invoice;

            }
        } catch (error) {
            console.log("Invoice error", error)
            return { errors: error };
        }

        try {
            if (invoiceStatus?.ok) {
                console.log("Starting sending email");
                const email = sendEmail(formData, registrationId);
                console.log("Email", email)
            }
        } catch (error) {
            console.log("Email error", error)
            return { errors: error };
        }


    //
    // Save to MySQL via Prisma
    /*await prisma.ContactForm.create({
        data: { name, email, country, phone_number }
    });*/

    return { success: true };
}

export default function Home() {
  const photos = [
      { src: "../../assets/img/conference/DSC_0789-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0697-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0777-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0681-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0659-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0627-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0611-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0442-1-1024x644.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0391-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0365-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0353-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0347-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0328-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0324-1-1024x683.jpeg", alt: "Beach sunset" },
      { src: "../../assets/img/conference/DSC_0229-1-1024x832.jpeg", alt: "WRT2024" }
  ]
  return (
      <>
        <Homeslider />
        <Topics />
        <Slider photos={photos}/>
        <Past />
        <Venue />
        <RegistrationForm />
      </>
  )
}



