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
                email: values.email,
                password: values.password,
                gender: values.gender,
                age: values.age,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Błąd rejestracji');
        }
        const result = await response.json();
        console.log('Rejestracja udana:', result);
        setShowPopup(true);
    } catch (error) {
        console.error('Błąd rejestracji:', error);
        if (error instanceof Error) {
            setError(error.message);
        } else if (typeof error === 'string') {
            setError(error);
        } else {
            setError('Wystąpił błąd');
        }
    } finally {
        setSubmitting(false);
    }
};
