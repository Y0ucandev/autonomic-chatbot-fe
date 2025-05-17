import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { loginAPI } from '../../services/LoginAPI';
import { api } from '../../config/api';

globalThis.fetch = vi.fn();

vi.mock('../../config/api', () => ({
    api: {
        apiInterceptor: 'http://mock-api.test'
    }
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('loginAPI', () => {
    const mockValues = {
        email: 'test@example.com',
        password: 'password123',
    };

    const mockSetSubmitting = vi.fn();
    const mockSetError = vi.fn();
    const mockNavigate = vi.fn();
    const mockSetUser = vi.fn();
    const mockUpdateToken = vi.fn();

    const mockSuccessResponse = {
        access_token: 'test-token-123',
        token_type: 'bearer',
        status: 'success'
    };

    const mockUserData = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        mockUpdateToken.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully log the user in and retrieve their data', async () => {
        const mockLoginResponse = new Response(JSON.stringify(mockSuccessResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        const mockUserResponse = new Response(JSON.stringify(mockUserData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockLoginResponse)
            .mockResolvedValueOnce(mockUserResponse);


        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(1, `${api.apiInterceptor}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: mockValues.email,
                password: mockValues.password,
            })
        });
        expect(fetch).toHaveBeenNthCalledWith(2, `${api.apiInterceptor}/users/me`, {
            headers: {
                'Authorization': `Bearer ${mockSuccessResponse.access_token}`
            }
        });

        expect(mockUpdateToken).toHaveBeenCalledWith(mockSuccessResponse.access_token);
        expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
        expect(mockNavigate).toHaveBeenCalledWith('/Uzytkownik');
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockSetError).toHaveBeenCalledTimes(1);
    });

    it('should handle authorization error (status 401)', async () => {
        const mockErrorResponse = new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockErrorResponse);

        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Registration error, missing or incorrect registration data');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockUpdateToken).not.toHaveBeenCalled();
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
    });

    it('should handle another server error', async () => {
        const mockErrorResponse = new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockErrorResponse);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Server error');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockUpdateToken).not.toHaveBeenCalled();
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should handle response without token', async () => {
        const mockNoTokenResponse = new Response(JSON.stringify({ status: 'success' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockNoTokenResponse);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('No token in response');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockUpdateToken).not.toHaveBeenCalled();
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should handle error while fetching user data', async () => {
        const mockLoginResponse = new Response(JSON.stringify(mockSuccessResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        vi.mocked(fetch).mockResolvedValueOnce(mockLoginResponse)
            .mockRejectedValueOnce(new Error('User fetch error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(mockUpdateToken).toHaveBeenCalledWith(mockSuccessResponse.access_token);
        expect(mockNavigate).toHaveBeenCalledWith('/Uzytkownik');
        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalledWith('Error getting user data:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('should handle rejection of fetch query', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await loginAPI(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser,
            mockUpdateToken
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Network error');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockUpdateToken).not.toHaveBeenCalled();
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});