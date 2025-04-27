
import { FormValues } from "../components/loginPage/userLogin/UserLogin";
export const loginAPI = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    setError: (error: string | null) => void,
    navigate: (path: string) => void
) => {
    try {
        setError(null);
        setSubmitting(true);
        const response = await fetch('https://url:/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            })
        });
        if (response.status === 200) {
            navigate('/');
        } else if (response.status === 422) {
            setError('Brakujące lub niepoprawne dane rejestracyjne');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Błąd rejestracji');
        }
    } catch (error) {
        console.error('Błąd rejestracji:', error);
        if (error instanceof Error) {
            setError(error.message);
        } else if (typeof error === 'string') {
            setError(error);
        } else {
            setError('Wystąpił nieoczekiwany błąd');
        }
    } finally {
        setSubmitting(false);
    }
};
