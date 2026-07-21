import { useEffect, useState } from "react";

// WhatsApp number in full international format, digits only (no "+", spaces or dashes).
// Example: Ukrainian number +380 50 123 4567  ->  "380501234567"
const WHATSAPP_NUMBER = "380939894400";

// Message pre-filled in the chat when a visitor opens it.
const PREFILLED_MESSAGE = "Hello WRT2026! I have a question about the conference.";

export default function WhatsAppWidget() {
    const [mounted, setMounted] = useState(false);

    // Avoid rendering during SSR so the floating button never flashes before hydration.
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

    return (
        <>
            <style>{whatsappStyles}</style>
            <a
                className="whatsapp-widget"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
            >
                <span className="whatsapp-widget__pulse" aria-hidden="true"></span>
                <svg
                    className="whatsapp-widget__icon"
                    viewBox="0 0 32 32"
                    width="30"
                    height="30"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        fill="currentColor"
                        d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.593 4.463 1.72 6.406L3.2 28.8l6.55-1.716a12.74 12.74 0 0 0 6.25 1.62h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.052A12.71 12.71 0 0 0 16.004 3.2Zm0 23.36h-.004a10.57 10.57 0 0 1-5.386-1.475l-.386-.23-4.008 1.05 1.07-3.906-.252-.4a10.55 10.55 0 0 1-1.62-5.6c0-5.86 4.77-10.63 10.636-10.63a10.56 10.56 0 0 1 7.51 3.115 10.55 10.55 0 0 1 3.11 7.52c0 5.862-4.77 10.63-10.636 10.63Zm5.83-7.96c-.32-.16-1.89-.932-2.182-1.038-.293-.107-.506-.16-.72.16-.213.32-.826 1.038-1.013 1.252-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.57-1.586-.95-.847-1.592-1.894-1.778-2.214-.187-.32-.02-.492.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.667 0 1.574 1.147 3.094 1.307 3.307.16.213 2.253 3.44 5.46 4.826.763.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.89-.772 2.156-1.518.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373Z"
                    />
                </svg>
                <span className="whatsapp-widget__label">Chat with us</span>
            </a>
        </>
    );
}

const whatsappStyles = `
.whatsapp-widget {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 9999;
    display: inline-flex;
    align-items: center;
    gap: 0;
    height: 60px;
    padding: 0 15px;
    border-radius: 30px;
    background-color: #25D366;
    color: #fff;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
    transition: max-width 0.35s ease, padding 0.35s ease, box-shadow 0.2s ease;
    overflow: hidden;
    max-width: 60px;
    white-space: nowrap;
}
.whatsapp-widget:hover,
.whatsapp-widget:focus-visible {
    max-width: 220px;
    box-shadow: 0 8px 22px rgba(37, 211, 102, 0.55);
    color: #fff;
}
.whatsapp-widget__icon {
    flex: 0 0 auto;
    display: block;
}
.whatsapp-widget__label {
    margin-left: 10px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.25s ease 0.05s;
}
.whatsapp-widget:hover .whatsapp-widget__label,
.whatsapp-widget:focus-visible .whatsapp-widget__label {
    opacity: 1;
}
.whatsapp-widget__pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #25D366;
    z-index: -1;
    animation: whatsapp-pulse 2s infinite;
}
@keyframes whatsapp-pulse {
    0% { transform: scale(1); opacity: 0.6; }
    70% { transform: scale(1.6); opacity: 0; }
    100% { transform: scale(1.6); opacity: 0; }
}
@media (max-width: 575px) {
    .whatsapp-widget {
        right: 16px;
        bottom: 16px;
    }
}
@media (prefers-reduced-motion: reduce) {
    .whatsapp-widget__pulse { animation: none; }
}
`;