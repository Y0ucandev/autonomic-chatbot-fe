import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleRegistration } from '../../services/handleRegistration';
import { FormValues } from '../../components/loginPage/userRegistration/UserRegistration';
const createFetchResponse = (data: any, status = 200) => {
    return {
        status,
        ok: status >= 200 && status < 300,
        json: () => Promise.resolve(data)
    };
};
describe('handleRegistration', () => {
    const mockSetSubmitting = vi.fn();
    const mockSetError = vi.fn();
    const mockSetShowPopup = vi.fn();
    const testValues: FormValues = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'Test User',
        gender: 'male',
        age: 25,
    };
    let localStorageMock: Record<string, string> = {};
    beforeEach(() => {
        vi.resetAllMocks();
        localStorageMock = {};
        globalThis.console.error = vi.fn();
        globalThis.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('powinien pomyślnie zarejestrować użytkownika', async () => {
        const mockResponse = {
            status: 'success'
        };
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse(mockResponse, 200)) as Promise<Response>
        );
        await handleRegistration(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup,
        );
        expect(fetch).toHaveBeenCalledWith('https://url:/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: testValues.name,
                email: testValues.email,
                password: testValues.password,
                gender: testValues.gender,
                age: testValues.age,
            })
        });
        expect(mockSetShowPopup).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith(null);
    });
    it('powinien obsłużyć błąd 400 - konto już istnieje', async () => {
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse({}, 400)) as Promise<Response>
        );
        await handleRegistration(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup,
        );
        expect(mockSetError).toHaveBeenCalledWith('Konto z podanym adresem email już istnieje');
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetShowPopup).not.toHaveBeenCalled();
    });
    it('powinien obsłużyć błąd 422 - niepoprawne dane', async () => {
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse({}, 422)) as Promise<Response>
        );
        await handleRegistration(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup,
        );
        expect(mockSetError).toHaveBeenCalledWith('Brakujące lub niepoprawne dane rejestracyjne');
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetShowPopup).not.toHaveBeenCalled();
    });
    it('powinien obsłużyć inny błąd z serwera', async () => {
        const errorMessage = 'Błąd serwera';
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.resolve(createFetchResponse({ message: errorMessage }, 500)) as Promise<Response>
        );
        await handleRegistration(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup,
        );
        expect(mockSetError).toHaveBeenCalledWith(errorMessage);
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetShowPopup).not.toHaveBeenCalled();
    })
    it('powinien obsłużyć inny błąd z serwera', async () => {
        const errorMessage = 'Błąd serwera';
        vi.mocked(globalThis.fetch).mockImplementationOnce(() =>
            Promise.reject(new Error('Błąd sieci'))
        );
        await handleRegistration(
            testValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup,
        );
        expect(console.error).toHaveBeenCalled();
        expect(mockSetError).toHaveBeenCalledWith('Błąd sieci');
        expect(mockSetSubmitting).toHaveBeenCalledWith(false);
        expect(mockSetShowPopup).not.toHaveBeenCalled();
    })
});