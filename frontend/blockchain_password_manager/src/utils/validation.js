export const isStrongPassword = (password) => {
    const minLength = /.{12,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const digit = /[0-9]/;

    return (
        minLength.test(password) &&
        upper.test(password) &&
        lower.test(password) &&
        digit.test(password)
    );
};