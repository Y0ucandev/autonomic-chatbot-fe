import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import AuthContext, { AuthProvider, User } from '../../context/AuthContext';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { tokenExpired } from '../../utils/tokenUtils';
import { refreshToken } from '../../services/authService';
import { setupInterceptors } from '../../services/apiInterceptor';
import { getUserProfile } from '../../services/userService';
import { ReactNode, useContext } from 'react';
import { AxiosResponse } from 'axios';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('../../utils/tokenUtils', () => ({
    tokenExpired: vi.fn(),
}));
vi.mock('../../services/authService', () => ({
    refreshToken: vi.fn(),
}));
vi.mock('../../services/apiInterceptor', () => ({
    setupInterceptors: vi.fn(),
}));
vi.mock('../../services/userService', () => ({
    getUserProfile: vi.fn(),
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

const TestComponent = () => {
    const { user, authenticated, logout } = useContext(AuthContext);

    return (
        <div>
            <div data-testid="authenticated">{authenticated ? 'true' : 'false'}</div>
            <div data-testid="user-name">{user?.name || 'No user'}</div>
            <button data-testid="logout-button" onClick={logout}>Logout</button>
        </div>
    );
};

const renderWithAuthProvider = (ui: ReactNode) => {
    return render(
        <AuthProvider>
            {ui}
        </AuthProvider>
    );
};

describe('AuthContext i AuthProvider', () => {
    const mockNavigate = vi.fn();
    const mockToken = 'mock-jwt-token';
    const mockUser: User = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        age: 30
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(tokenExpired).mockReturnValue(false);
        vi.mocked(setupInterceptors).mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize as not logged in when no token is provided', async () => {
        vi.mocked(localStorageMock.getItem).mockReturnValue(null);

        renderWithAuthProvider(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
    });

    it('should initialize as logged in with a valid token and retrieve user data', async () => {
        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(getUserProfile).mockResolvedValue({
            data: mockUser,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        } as AxiosResponse<User>);

        renderWithAuthProvider(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('user-name')).toHaveTextContent(mockUser.name);
        expect(setupInterceptors).toHaveBeenCalledWith(mockToken);
    });

    it('should log the user out when the token is expired', async () => {
        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(tokenExpired).mockReturnValue(true);

        renderWithAuthProvider(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(mockNavigate).toHaveBeenCalledWith('/Logowanie');
    });

    it('should handle error while fetching user profile', async () => {

        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(getUserProfile).mockRejectedValue(new Error('Failed to fetch user profile'));

        renderWithAuthProvider(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('should log the user out after clicking the logout button', async () => {

        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(getUserProfile).mockResolvedValue({
            data: mockUser,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        } as AxiosResponse<User>);

        renderWithAuthProvider(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        act(() => {
            screen.getByTestId('logout-button').click();
        });

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(mockNavigate).toHaveBeenCalledWith('/Logowanie');
    });

    it('should refresh the token when called refreshUserToken', async () => {

        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(getUserProfile).mockResolvedValue({
            data: mockUser,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        } as AxiosResponse<User>);

        const newToken = 'new-mock-token';
        vi.mocked(refreshToken).mockResolvedValue({
            data: { token: newToken },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        } as AxiosResponse<{ token: string }>);

        let authContextValue: any;
        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(context) => {
                        authContextValue = context;
                        return <TestComponent />;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        await act(async () => {
            await authContextValue.refreshUserToken();
        });

        expect(refreshToken).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', newToken);
        expect(setupInterceptors).toHaveBeenCalledWith(newToken);
    });

    it('should log user out when token refresh fails', async () => {
        vi.mocked(localStorageMock.getItem).mockReturnValue(mockToken);
        vi.mocked(getUserProfile).mockResolvedValue({
            data: mockUser,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        } as AxiosResponse<User>);

        vi.mocked(refreshToken).mockRejectedValue(new Error('Failed to refresh token'));

        let authContextValue: any;
        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(context) => {
                        authContextValue = context;
                        return <TestComponent />;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        await act(async () => {
            await authContextValue.refreshUserToken();
        });

        expect(refreshToken).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/Logowanie');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    });
});