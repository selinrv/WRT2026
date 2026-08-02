import * as React from 'react'
import {
  isRouteErrorResponse,
  Link,
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

// Rendered inside Layout, so it returns page content only — no <html> shell.
export function ErrorBoundary({ error }) {
  let title = 'An error occurred';
  let message = 'Something went wrong. Please try again later.';
  let stack = null;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `${error.status} ${error.statusText}`;
    message =
        error.status === 404
            ? 'The page you are looking for does not exist.'
            : error.data?.message || (typeof error.data === 'string' ? error.data : message);
  } else if (error instanceof Error) {
    message = error.message;
    // Only in dev — React Router already redacts server errors in production.
    if (import.meta.env.DEV) stack = error.stack;
  }

  return (
      <main className="error-boundary pt-100 pb-100">
        <div className="container text-center">
          <h3>{title}</h3>
          <p>{message}</p>
          {stack && <pre className="error-boundary__stack">{stack}</pre>}
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </div>
        <style>{`
          .error-boundary { padding-top: 160px; padding-bottom: 120px; }
          .error-boundary h3 { color:#1f2937; margin-bottom:14px; }
          .error-boundary p { color:#6b7280; }
          .error-boundary a { color:#1c63ff; font-weight:600; }
          .error-boundary__stack { text-align:left; background:#f7f9fc; border:1px solid #eef1f6; border-radius:12px; padding:18px; overflow-x:auto; font-size:12.5px; color:#374151; margin:20px 0; }
        `}</style>
      </main>
  );
}

