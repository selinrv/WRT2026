import { index, route } from "@react-router/dev/routes";

export default [index("routes/home.jsx"),
    route("auth/google/callback", "routes/auth/google/callback.jsx"),
    route("auth/google", "routes/auth/google.jsx"),
    route("privacy-policy", "routes/privacy.jsx")
];
