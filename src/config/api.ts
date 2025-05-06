type Api = {
    pwnedPasswords: string;
    endpoints: {
        range: string;
    };
}

export const api: Api = {
    pwnedPasswords: 'https://api.pwnedpasswords.com',
    endpoints: {
        range: '/range/'
    }
};