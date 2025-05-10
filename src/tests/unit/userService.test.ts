import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getUserProfile } from '../../services/userService';
import apiInterceptor from '../../services/apiInterceptor';
import { User } from '../../context/AuthContext';

vi.mock('../../services/apiInterceptor', () => ({
    default: {
        get: vi.fn()
    }
}));

describe('User service', () => {
    const mockUserData: User = {
        name: 'Test User',
        email: 'test@example.com',
        password: '',
        confirmPassword: '',
        gender: 'male',
        age: 30
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('getUserProfile', () => {
        it('should call apiInterceptor.get with correct endpoint', async () => {
            vi.mocked(apiInterceptor.get).mockResolvedValue({
                data: mockUserData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            });

            const result = await getUserProfile();

            expect(apiInterceptor.get).toHaveBeenCalledTimes(1);
            expect(apiInterceptor.get).toHaveBeenCalledWith('/users/me');
            expect(result.data).toEqual(mockUserData);
        });

        it('should propagate errors when API request fails', async () => {
            const errorMessage = 'Failed to fetch user profile';
            vi.mocked(apiInterceptor.get).mockRejectedValue(new Error(errorMessage));

            await expect(getUserProfile()).rejects.toThrow(errorMessage);
            expect(apiInterceptor.get).toHaveBeenCalledTimes(1);
            expect(apiInterceptor.get).toHaveBeenCalledWith('/users/me');
        });
    });
});