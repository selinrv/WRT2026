import { index, route } from "@react-router/dev/routes";

export default [index("routes/home.jsx"),
    route("registration", "routes/registration.jsx"),
    route("registration/new", "routes/registration/new.jsx")
];
