import { FormValues } from "../components/loginPage/userRegistration/UserRegistration";
export const handleRegistration = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    setError: (error: string | null) => void,
    setShowPopup: (show: boolean) => void
) => {
    try {
        setError(null);
        setSubmitting(true);
        const response = await fetch('https://url:/users/register', {
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
        if (response.status === 200) {
            setShowPopup(true);
        } else if (response.status === 400) {
            setError('Konto z podanym adresem email już istnieje');
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
