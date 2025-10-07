import { useNavigate } from "react-router-dom";
import { google } from "googleapis";

import { data } from "react-router";

export async function loader({ request }) {
    const { getSession, commitSession } = await import("../../../data/session.server");
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        throw data("Missing authorization code", { status: 400 });
    }

}

export default function Callback() {
    const navigate = useNavigate();
    navigate("/");
    return <p>Redirecting...</p>;
}
