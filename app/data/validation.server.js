import { topics } from "../components/topics";

// Registration category values that correspond to the "Online" categories
// defined in app/components/registration.jsx (Online / Online + Paper). Poster
// presentations are not offered for these.
const ONLINE_CATEGORY_VALUES = ["1", "100"];

function isValidName(value) {
    return value && value.trim().length > 0 && value.trim().length <= 200;
}

function isValidAbstract(value) {
    return value && value.trim().length > 0 && value.trim().length <= 3500;
}

function isValidAbstractTitle(value) {
    return value && value.trim().length > 0 && value.trim().length <= 300;
}

function isValidAmount(value) {
    const amount = parseFloat(value);
    return !isNaN(amount) && amount > 0;
}

function isValidEmail(value) {
    return value && value.trim().length > 0 && value.trim().length <= 100 && value.includes('@');
}

function isValidOrcidId(value) {
    // ORCID iD: 16 digits in groups of 4, last character may be an X checksum.
    return value && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value.trim());
}

function isValidDate(value) {
    return value && new Date(value).getTime() < new Date().getTime();
}

function isValidSelected(value) {
    const allowed = ["350", "175", "50", "150", "250", "300", "200", "201", "202", "1", "100"];
    if (allowed.includes(value)) {
        return value;
    }
}

function isValidTopic(selectedValue) {
    const isValid = topics.some((item) => item.name === selectedValue);
    return selectedValue && isValid;
}

function isValidType(value) {
    const allowed = ["Oral in Person", "Oral Online", "Poster"];
    if (allowed.includes(value)) {
        return value;
    }
}

export function validateInput(input) {
    let validationErrors = {};

    // "Online viewing without participation and abstract" registrations submit no
    // abstract at all, so the abstract checks below do not apply to them.
    const isOnlineViewing = input.online_viewing === "yes";

    if (!isOnlineViewing && !isValidAbstract(input.abstract)) {
        validationErrors.title = 'Incorrect abstract. Must be at most 3500 characters long.'
    }

    if (!isValidSelected(input.category)) {
        validationErrors.title = 'Please select registration category.'
    }

    // Online viewing registrations hide the topic and presentation type fields,
    // so these checks do not apply to them.
    if (!isOnlineViewing && !isValidTopic(input.topic)) {
        validationErrors.title = 'Please select registration conference topic.'
    }

    if (!isOnlineViewing && !isValidType(input.p_type)) {
        validationErrors.title = 'Please select type of your presentation.'
    }

    if (ONLINE_CATEGORY_VALUES.includes(String(input.category)) && input.p_type === "Poster") {
        validationErrors.title = 'Poster presentation is not available for the Online registration categories.'
    }

    if (!isOnlineViewing && !isValidAbstractTitle(input.abstract_title)) {
        validationErrors.title = 'Abstract title cannot be empty.'
    }

    if (!isValidName(input.institutions)) {
        validationErrors.title = 'Organizations field cannot be empty and no longer than 200 characters.'
    }

    if (!isValidEmail(input.email)) {
        validationErrors.title = 'Incorrect email.';
    }

    if (!isOnlineViewing && !isValidOrcidId(input.orcidId)) {
        validationErrors.title = 'Please provide a valid ORCID iD (e.g. 0000-0002-1825-0097).';
    }

    if (!isValidName(input.author)) {
        validationErrors.title = 'Incorrect author name. Must be at most 100 characters long.'
    }

    if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
    }
}