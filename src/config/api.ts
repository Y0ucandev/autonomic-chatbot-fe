type Api = {
    apiInterceptor: string;
    pwnedPasswords: string;
    endpoints: {
        range: string;
    };
}

export const api: Api = {
    apiInterceptor: 'http://localhost:8000',
    pwnedPasswords: 'https://api.pwnedpasswords.com',
    endpoints: {
        range: '/range/'
    }
};