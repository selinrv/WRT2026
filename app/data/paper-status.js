// The review states a paper can be in. Shared by the admin UI (to build the
// dropdown) and the server (to reject anything not on this list), so the two
// can't drift apart. Not a *.server.js file — it must reach the browser too.
//
// The first entry has to stay in sync with the Paper.status default in
// prisma/schema.prisma.
export const PAPER_STATUSES = [
    "Uploaded. Waiting to start the review process",
    "Paper review in progress",
    "Paper accepted",
    "Paper requires corrections from the author (check the correspondent email)",
    "Paper declined",
];

export function isValidPaperStatus(status) {
    return PAPER_STATUSES.includes(status);
}

// Drives the colour accent on the admin dropdown, so the table still reads at a
// glance now that the status is an editable control rather than a badge.
export function statusTone(status) {
    switch (status) {
        case "Paper accepted":
            return "accepted";
        case "Paper declined":
            return "declined";
        case "Paper requires corrections from the author (check the correspondent email)":
            return "corrections";
        case "Paper review in progress":
            return "review";
        default:
            return "new";
    }
}
