import { topics } from "../components/topics";
function isValidName(value) {
    return value && value.trim().length > 0 && value.trim().length <= 100;
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

function isValidDate(value) {
    return value && new Date(value).getTime() < new Date().getTime();
}

function isValidSelected(value) {
    const allowed = ["350", "175", "50", "150"];
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

    if (!isValidAbstract(input.abstract)) {
        validationErrors.title = 'Incorrect abstract. Must be at most 3500 characters long.'
    }

    if (!isValidSelected(input.category)) {
        validationErrors.title = 'Please select registration category.'
    }

    if (!isValidTopic(input.topic)) {
        validationErrors.title = 'Please select registration conference topic.'
    }

    if (!isValidType(input.p_type)) {
        validationErrors.title = 'Please select type of your presentation.'
    }

    if (!isValidAbstractTitle(input.abstract_title)) {
        validationErrors.title = 'Abstract title cannot be empty.'
    }

    if (!isValidName(input.institutions)) {
        validationErrors.title = 'Institutions field cannot be empty.'
    }


    if (!isValidEmail(input.email)) {
        validationErrors.title = 'Incorrect email.';
    }

    if (!isValidName(input.author)) {
        validationErrors.title = 'Incorrect author name. Must be at most 100 characters long.'
    }

    if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
    }
}