import * as React from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData
} from "react-router";


import "../assets/css/main.css";
import "../assets/css/animate.css";
import "../assets/css/LineIcons.2.0.css";
import "../assets/css/bootstrap-5.0.0-beta1.min.css";
import Header from "./header/header.jsx";
import Footer from "./footer/footer.jsx";
import WhatsAppWidget from "./components/whatsapp.jsx";
import { Toaster } from "sonner";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "preload",
    as: "script",
    href: "../assets/js/main.js"
  },
  { rel: "icon", type: "image/ico", href: "assets/img/favicon.ico" }
];

export async function loader() {
  return Response.json({
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID ?? null
  });
}

export function Layout({ children }) {
  const { GA_MEASUREMENT_ID } = useRouteLoaderData("root") ?? { GA_MEASUREMENT_ID: null };
  const location = useLocation();
  React.useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
    // If you use Consent Mode and haven’t granted consent yet, skip here.
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search
    });
  }, [location, GA_MEASUREMENT_ID]);

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="canonical" href="https://wrt2026.com.ua/"/>
      <Meta/>
      <Links/>
      <script src={"../assets/js/main.js"}></script>
      <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, w, c) {
                  w.BrevoConversationsID = '669f70a2c5a9b43f4847aeed';
                  w[c] = w[c] || function() {
                      (w[c].q = w[c].q || []).push(arguments);
                  };
                  var s = d.createElement('script');
                  s.async = true;
                  s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
                  if (d.head) d.head.appendChild(s);
              })(document, window, 'BrevoConversations');
            `
          }}
      />

      {GA_MEASUREMENT_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}/>
            <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  // Disable automatic page_view; we’ll send our own on route changes.
                  gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                `
                }}
            />
          </>
      ) : null}

    </head>
    <body>
    <Header/>
    {children}
    <Footer/>
    {/* <WhatsAppWidget /> */}
    <Toaster position="bottom-center" richColors/>
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
}

export default function App() {
  return <Outlet/>;
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
      <Document title={caughtResponse.statusText}>
        <main>
          <Error title={caughtResponse.statusText}>
            <p>
              {caughtResponse.data?.message ||
                  'Something went wrong. Please try again later.'}
            </p>
            <p>
              Back to <Link to="/">safety</Link>.
            </p>
          </Error>
        </main>
      </Document>
  );
}

export function ErrorBoundary({ error }) {
  return (
      <Document title="An error occurred">
        <main>
          <Error title="An error occurred">
            <p>
              {error.message || 'Something went wrong. Please try again later.'}
            </p>
            <p>
              Back to <Link to="/">safety</Link>.
            </p>
          </Error>
        </main>
      </Document>
  );
}

