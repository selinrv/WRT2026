import { index, route } from "@react-router/dev/routes";

export default [index("routes/home.jsx"),
    route("auth/google/callback", "routes/auth/google/callback.jsx"),
    route("auth/google", "routes/auth/google.jsx"),
    route("privacy-policy", "routes/privacy.jsx"),
    route("contact-form", "routes/contact.jsx"),
    route("paper-upload", "routes/paper-upload.jsx"),
    route("admin", "routes/admin.jsx")
];
