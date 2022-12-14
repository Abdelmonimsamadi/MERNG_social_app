import validator from "validator"

export const registerValidators = (name, email, password, confirmPassword) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'name must not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        if (!validator.isEmail(email)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (password === '') {
        errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}

export const loginValidators = (email, password) => {
    const errors = {};
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    }
    if (password === '') {
        errors.password = 'Password must not empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}