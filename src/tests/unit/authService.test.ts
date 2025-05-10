import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { register, login, refreshToken, logout, verifyToken } from '../../services/authService';
import publicAxios from '../../services/publicAxios';
import apiInterceptor from '../../services/apiInterceptor';

vi.mock('../../services/publicAxios', () => ({
    default: {
        post: vi.fn()
    }
}));

vi.mock('../../services/apiInterceptor', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}));

describe('Auth service', () => {
    const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        age: 30
    };

    const mockCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    const mockAuthResponse = {
        token: 'test-token-123',
        user: mockUserData
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('register', () => {
        it('should call publicAxios.post with correct arguments', async () => {
            vi.mocked(publicAxios.post).mockResolvedValue({ data: mockAuthResponse });

            const result = await register(mockUserData);

            expect(publicAxios.post).toHaveBeenCalledWith('/users/register', mockUserData);
            expect(result.data).toEqual(mockAuthResponse);
        });

        it('should throw an error when registration fails', async () => {
            const errorMessage = 'Registration failed';
            vi.mocked(publicAxios.post).mockRejectedValue(new Error(errorMessage));

            await expect(register(mockUserData)).rejects.toThrow(errorMessage);
        });
    });

    describe('login', () => {
        it('should call publicAxios.post with correct arguments', async () => {
            vi.mocked(publicAxios.post).mockResolvedValue({ data: mockAuthResponse });

            const result = await login(mockCredentials);

            expect(publicAxios.post).toHaveBeenCalledWith('/users/login', mockCredentials);
            expect(result.data).toEqual(mockAuthResponse);
        });

        it('should throw an error when login fails', async () => {
            const errorMessage = 'Invalid credentials';
            vi.mocked(publicAxios.post).mockRejectedValue(new Error(errorMessage));

            await expect(login(mockCredentials)).rejects.toThrow(errorMessage);
        });
    });

    describe('refreshToken', () => {
        it('should call apiInterceptor.post with correct arguments', async () => {
            const mockResponse = { data: { token: 'new-token-456' } };
            vi.mocked(apiInterceptor.post).mockResolvedValue(mockResponse);

            const result = await refreshToken();

            expect(apiInterceptor.post).toHaveBeenCalledWith('/users/refresh-token');
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error when token refresh fails', async () => {
            const errorMessage = 'Token refresh failed';
            vi.mocked(apiInterceptor.post).mockRejectedValue(new Error(errorMessage));

            await expect(refreshToken()).rejects.toThrow(errorMessage);
        });
    });

    describe('logout', () => {
        it('should call apiInterceptor.post with correct arguments and return true on success', async () => {
            vi.mocked(apiInterceptor.post).mockResolvedValue({});

            const result = await logout();

            expect(apiInterceptor.post).toHaveBeenCalledWith('/users/logout');
            expect(result).toBe(true);
        });

        it('should handle errors and return false when logout fails', async () => {
            const errorMessage = 'Logout failed';
            vi.mocked(apiInterceptor.post).mockRejectedValue(new Error(errorMessage));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const result = await logout();

            expect(apiInterceptor.post).toHaveBeenCalledWith('/users/logout');
            expect(consoleSpy).toHaveBeenCalled();
            expect(result).toBe(false);

            consoleSpy.mockRestore();
        });
    });

    describe('verifyToken', () => {
        it('should call apiInterceptor.get with correct arguments and return true on success', async () => {
            vi.mocked(apiInterceptor.get).mockResolvedValue({});

            const result = await verifyToken();

            expect(apiInterceptor.get).toHaveBeenCalledWith('/users/verify-token');
            expect(result).toBe(true);
        });

        it('should return false when token verification fails', async () => {
            vi.mocked(apiInterceptor.get).mockRejectedValue(new Error('Invalid token'));

            const result = await verifyToken();

            expect(apiInterceptor.get).toHaveBeenCalledWith('/users/verify-token');
            expect(result).toBe(false);
        });
    });
});