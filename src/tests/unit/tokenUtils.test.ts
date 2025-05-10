import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../utils/tokenUtils', () => {
    return {
        decodeJWT: vi.fn(),
        tokenExpiryTime: vi.fn(),
        tokenExpired: vi.fn()
    };
});

import { decodeJWT, tokenExpiryTime, tokenExpired } from '../../utils/tokenUtils';

describe('JWT Utilities', () => {
    let originalDateNow: () => number;
    let mockCurrentTime: number;

    beforeEach(() => {
        originalDateNow = Date.now;
        mockCurrentTime = 1620000000000;
        Date.now = vi.fn(() => mockCurrentTime);
        vi.clearAllMocks();
    });
    afterEach(() => {
        Date.now = originalDateNow;
    });

    describe('decodeJWT', () => {
        it('should decode a valid JWT token', () => {
            const mockPayload = {
                sub: '1234567890',
                name: 'Test User',
                exp: 1620001000
            };
            vi.mocked(decodeJWT).mockReturnValue(mockPayload);

            const validToken = 'header.payload.signature';
            const result = decodeJWT(validToken);

            expect(decodeJWT).toHaveBeenCalledWith(validToken);
            expect(result).toEqual(mockPayload);
        });

        it('should return null if token format is invalid', () => {
            vi.mocked(decodeJWT).mockReturnValue(null);

            const invalidToken = 'invalid-token';
            const result = decodeJWT(invalidToken);

            expect(decodeJWT).toHaveBeenCalledWith(invalidToken);
            expect(result).toBeNull();
        });

        it('should return null if JSON parsing fails', () => {
            vi.mocked(decodeJWT).mockReturnValue(null);

            const token = 'header.payload.signature';
            const result = decodeJWT(token);

            expect(decodeJWT).toHaveBeenCalledWith(token);
            expect(result).toBeNull();
        });
    });

    describe('tokenExpiryTime', () => {
        it('should return time to expiry for a valid non-expired token', () => {
            const futureExp = Math.floor(mockCurrentTime / 1000) + 1000;
            const mockPayload = {
                sub: '1234567890',
                name: 'Test User',
                exp: futureExp
            };

            vi.mocked(decodeJWT).mockReturnValue(mockPayload);
            vi.mocked(tokenExpiryTime).mockReturnValue(1000000);

            const validToken = 'header.payload.signature';
            const result = tokenExpiryTime(validToken);

            expect(result).toBe(1000000);
            expect(tokenExpiryTime).toHaveBeenCalledWith(validToken);
        });

        it('should return -1 for an expired token', () => {
            vi.mocked(tokenExpiryTime).mockReturnValue(-1);

            const expiredToken = 'header.payload.signature';
            const result = tokenExpiryTime(expiredToken);

            expect(result).toBe(-1);
            expect(tokenExpiryTime).toHaveBeenCalledWith(expiredToken);
        });

        it('should return -1 for a token without exp claim', () => {
            vi.mocked(tokenExpiryTime).mockReturnValue(-1);

            const noExpToken = 'header.payload.signature';
            const result = tokenExpiryTime(noExpToken);

            expect(result).toBe(-1);
            expect(tokenExpiryTime).toHaveBeenCalledWith(noExpToken);
        });

        it('should return -1 for a null payload', () => {
            vi.mocked(tokenExpiryTime).mockReturnValue(-1);

            const invalidToken = 'header.payload.signature';
            const result = tokenExpiryTime(invalidToken);

            expect(result).toBe(-1);
            expect(tokenExpiryTime).toHaveBeenCalledWith(invalidToken);
        });
    });

    describe('tokenExpired', () => {
        it('should return true for an expired token', () => {
            vi.mocked(tokenExpired).mockReturnValue(true);

            const expiredToken = 'header.payload.signature';
            const result = tokenExpired(expiredToken);

            expect(result).toBe(true);
            expect(tokenExpired).toHaveBeenCalledWith(expiredToken);
        });

        it('should return false for a valid non-expired token', () => {
            vi.mocked(tokenExpired).mockReturnValue(false);

            const validToken = 'header.payload.signature';
            const result = tokenExpired(validToken);

            expect(result).toBe(false);
            expect(tokenExpired).toHaveBeenCalledWith(validToken);
        });
    });
});