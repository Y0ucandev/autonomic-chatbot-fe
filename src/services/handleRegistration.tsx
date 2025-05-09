import { FormValues } from "../components/loginPage/userRegistration/UserRegistration";
import { api } from "../config/api";

export const handleRegistration = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    setError: (error: string | null) => void,
    setShowPopup: (show: boolean) => void,
) => {
    try {
        setError(null);
        setSubmitting(true);

        const response = await fetch(`${api.apiInterceptor}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
                gender: values.gender,
                age: parseInt(values.age.toString()),
            })
        });

        switch (response.status) {
            case 200:
                setShowPopup(true);
                break;
            case 400:
                setError('Konto z podanym adresem email już istnieje');
                break;
            case 422:
                setError('Brakujące lub niepoprawne dane rejestracyjne');
                break;
            default:
                const errorData = await response.json();
                throw new Error(errorData.message || 'Błąd rejestracji');
        }

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
            setError(error.message);
        } else if (typeof error === 'string') {
            setError(error);
        } else {
            setError('An unexpected error occurred');
        }
    } finally {
        setSubmitting(false);
    }
};
