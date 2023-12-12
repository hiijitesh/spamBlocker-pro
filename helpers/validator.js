function validateName(name) {
    const nameValidatorRegex = /^[a-zA-Z ]{2,30}$/;
    return nameValidatorRegex.test(name);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validatePhoneNumber(phoneNumber) {
    const phoneValidatorRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneValidatorRegex.test(phoneNumber);
}

function validateEmail(email) {
    const emailValidatorRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailValidatorRegex.test(email);
}

module.exports = {
    validateName,
    validatePassword,
    validatePhoneNumber,
    validateEmail,
};
