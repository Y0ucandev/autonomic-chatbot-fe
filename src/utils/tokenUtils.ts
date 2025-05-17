export const decodeJWT = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

export const tokenExpiryTime = (token: string): number => {
    const payload = decodeJWT(token);

    if (!payload || !payload.exp) {
        return -1;
    }
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeToExpiry = expiryTime - currentTime;
    return timeToExpiry > 0 ? timeToExpiry : -1;
};

export const tokenExpired = (token: string): boolean => {
    return tokenExpiryTime(token) <= 0;
};
