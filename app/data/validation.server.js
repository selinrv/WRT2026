function isValidName(value) {
    return value && value.trim().length > 0 && value.trim().length <= 100;
}

function isValidAbstract(value) {
    return value && value.trim().length > 0 && value.trim().length <= 3500;
}

function isValidAmount(value) {
    const amount = parseFloat(value);
    return !isNaN(amount) && amount > 0;
}

function isValidDate(value) {
    return value && new Date(value).getTime() < new Date().getTime();
}

export function validateInput(input) {
    let validationErrors = {};

    if (!isValidName(input.author)) {
        validationErrors.title = 'Incorrect author name. Must be at most 100 characters long.'
    }

    if (!isValidAbstract(input.abstract)) {
        validationErrors.title = 'Incorrect abstract. Must be at most 3500 characters long.'
    }

    if (!isValidAmount(input.amount)) {
        validationErrors.amount = 'Invalid amount. Must be a number greater than zero.'
    }

    if (!isValidDate(input.date)) {
        validationErrors.date = 'Invalid date. Must be a date before today.'
    }

    if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
    }
}