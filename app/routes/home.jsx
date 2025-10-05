import Homeslider from "../components/homeslider";
import Topics from "../components/topics";
import ContactForm from "../components/contact";
import RegistrationForm from "../components/registration";
import { isValidPhoneNumber } from 'react-phone-number-input'


export function meta() {
  return [
    { title: "WRT2026 Conference - Uzhhorod, Ukraine" },
    { name: "description", content: "WRT2026 - Welding and Related Technologies Conference 2026, organized by the E.O.Paton Electric Welding Institute of the National Academy of Sciences of Ukraine" },
  ];
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function action({ request }) {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);
    const { sendEmail } = await import("../data/email.server");
    sendEmail(formData);
    // Save to MySQL via Prisma
    /*await prisma.ContactForm.create({
        data: { name, email, country, phone_number }
    });*/

    return { success: true };
}

export default function Home() {
  return (
      <>
        <Homeslider />
        <Topics />
        <RegistrationForm />
      </>
  )
}



