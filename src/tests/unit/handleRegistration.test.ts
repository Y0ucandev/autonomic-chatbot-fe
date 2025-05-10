import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { handleRegistration } from '../../services/handleRegistration';
import { api } from '../../config/api';

globalThis.fetch = vi.fn();

describe('handleRegistration', () => {
    const mockValues = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        age: 30,
    };

    const mockSetSubmitting = vi.fn();
    const mockSetError = vi.fn();
    const mockSetShowPopup = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully register the user (status 200)', async () => {
        const mockSuccessResponse = new Response(JSON.stringify({ message: 'Użytkownik został zarejestrowany' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockSuccessResponse);

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${api.apiInterceptor}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: mockValues.name,
                email: mockValues.email,
                password: mockValues.password,
                gender: mockValues.gender,
                age: mockValues.age,
            })
        });
        expect(mockSetShowPopup).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenCalledWith(true);
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockSetError).toHaveBeenCalledTimes(1);
    });

    it('should handle error when email already exists (status 400)', async () => {
        const mockErrorResponse = new Response(JSON.stringify({ message: 'Email already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockErrorResponse);

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Konto z podanym adresem email już istnieje');
        expect(mockSetShowPopup).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
    });

    it('should handle validation error (status 422)', async () => {
        const mockValidationResponse = new Response(JSON.stringify({ message: 'Validation error' }), {
            status: 422,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockValidationResponse);

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Brakujące lub niepoprawne dane rejestracyjne');
        expect(mockSetShowPopup).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
    });

    it('should handle another server error', async () => {
        const mockErrorResponse = new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
        vi.mocked(fetch).mockResolvedValueOnce(mockErrorResponse);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Server error');
        expect(mockSetShowPopup).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should handle rejection of fetch query', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('Network error');
        expect(mockSetShowPopup).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('should handle unknown error type', async () => {
        const unknownError = { someProperty: 'some value' };
        vi.mocked(fetch).mockRejectedValueOnce(unknownError);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await handleRegistration(
            mockValues,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('An unexpected error occurred');
        expect(mockSetShowPopup).not.toHaveBeenCalled();
        expect(mockSetSubmitting).toHaveBeenLastCalledWith(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should correctly handle age to number conversion', async () => {
        const valuesWithStringAge = {
            ...mockValues,
            age: '25' as unknown as number
        };

        const mockSuccessResponse = new Response(JSON.stringify({ message: 'Użytkownik został zarejestrowany' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        vi.mocked(fetch).mockResolvedValueOnce(mockSuccessResponse);

        await handleRegistration(
            valuesWithStringAge,
            { setSubmitting: mockSetSubmitting },
            mockSetError,
            mockSetShowPopup
        );

        expect(fetch).toHaveBeenCalledWith(`${api.apiInterceptor}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: valuesWithStringAge.name,
                email: valuesWithStringAge.email,
                password: valuesWithStringAge.password,
                gender: valuesWithStringAge.gender,
                age: 25,
            })
        });
        expect(mockSetShowPopup).toHaveBeenCalledWith(true);
    });
});