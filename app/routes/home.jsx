import Homeslider from "../components/homeslider";
import Topics from "../components/topics";
import Slider from "../components/slider";
import Past from "../components/pastconference";
import RegistrationForm from "../components/registration";



export function meta() {
  return [
    { title: "WRT2026 Conference - Uzhhorod, Ukraine" },
    { name: "description", content: "WRT2026 - Welding and Related Technologies Conference 2026, organized by the E.O.Paton Electric Welding Institute of the National Academy of Sciences of Ukraine" },
  ];
}

import { PrismaClient } from '@prisma/client';
import {validateInput} from "../data/validation.server.js";

const prisma = new PrismaClient();
export async function action({ request }) {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);
    const { sendEmail } = await import("../data/email.server");
    const { AddToDoc } = await import("../data/google.server");
    try {
        validateInput(Object.fromEntries(formData))
    } catch (error) {
        return { errors: error };
    }
    try {
        await sendEmail(formData)
    } catch (error) {
        return { errors: error };
    }

    const doc = await AddToDoc(formData);

    //sendEmail(formData);
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
        <RegistrationForm />
      </>
  )
}



