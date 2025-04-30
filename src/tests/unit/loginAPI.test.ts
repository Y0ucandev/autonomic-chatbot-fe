import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginAPI } from '../../services/loginAPI';
import { FormValues } from '../../components/loginPage/userLogin/UserLogin'
const createFetchResponse = (data: any, status = 200) => {
    return {
        status,
        ok: status >= 200 && status < 300,
        json: () => Promise.resolve(data)
    };
};
describe('loginAPI', () => {
    const mockSetSubmitting = vi.fn();
    const mockSetError = vi.fn();
    const mockNavigate = vi.fn();
    const mockSetUser = vi.fn();
    const testValues: FormValues = {
        email: 'test@example.com',
        password: 'password123'
    };
    let localStorageMock: Record<string, string> = {};
    beforeEach(() => {
        vi.resetAllMocks();
        localStorageMock = {};
        globalThis.localStorage = {
            getItem: vi.fn((key) => localStorageMock[key] || null),
            setItem: vi.fn((key, value) => {
                localStorageMock[key] = value;
            }),
            removeItem: vi.fn((key) => {
                delete localStorageMock[key];
            }),
            clear: vi.fn(() => {
                localStorageMock = {};
            }),
            length: 0,
            key: vi.fn((index) => ''),
        };
        globalThis.console.error = vi.fn();
        globalThis.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('powinien pomyślnie zalogować użytkownika i pobrać jego dane', async () => {
        const mockLoginResponse = {
            access_token: 'test_token_123',
            token_type: 'Bearer',
            status: 'success'
        };
        const mockUserData = {
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        };
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockLoginResponse, 200)) as Promise<Response>
        ).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockUserData, 200)) as Promise<Response>
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(fetch).toHaveBeenNthCalledWith(1, 'https://url:/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testValues.email,
                password: testValues.password,
            })
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test_token_123');
        expect(fetch).toHaveBeenNthCalledWith(2, 'https://url:/users/me', {
            headers: {
                'Authorization': 'Bearer test_token_123'
            }
        });
        expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith(null);
    });

    it('powinien obsłużyć błąd autoryzacji (401)', async () => {
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse({}, 401)) as Promise<Response>
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith('Brakujące lub niepoprawne dane rejestracyjne');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('powinien obsłużyć brak tokenu w odpowiedzi', async () => {
        const mockResponseWithoutToken = {
            // Brak access_token
            token_type: 'Bearer',
            status: 'success'
        };
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockResponseWithoutToken, 200)) as Promise<Response>
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith('Brak tokenu w odpowiedzi');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('powinien obsłużyć inny błąd HTTP', async () => {
        const mockErrorResponse = {
            message: 'Błąd serwera'
        };

        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockErrorResponse, 500)) as Promise<Response>
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith('Błąd serwera');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('powinien obsłużyć wyjątek podczas wywołania fetch', async () => {
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.reject(new Error('Błąd sieci'))
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith('Błąd sieci');
        expect(console.error).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('powinien obsłużyć błąd podczas pobierania danych użytkownika', async () => {
        const mockLoginResponse = {
            access_token: 'test_token_123',
            token_type: 'Bearer',
            status: 'success'
        };
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockLoginResponse, 200)) as Promise<Response>
        ).mockImplementationOnce(() =>
            Promise.reject(new Error('Błąd pobierania danych'))
        );
        await loginAPI(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockNavigate,
            mockSetUser
        );
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test_token_123');
        expect(console.error).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
    });
});