
import { FormValues } from "../components/loginPage/userLogin/UserLogin";
interface LoginResponse {
    access_token: string;
    token_type: string;
    status: string;
}
export const loginAPI = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    setError: (error: string | null) => void,
    navigate: (path: string) => void,
    setUser: (user: any) => void
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
            const data: LoginResponse = await response.json();
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                try {
                    const userResponse = await fetch('https://url:/users/me', {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`
                        }
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUser(userData);
                    }
                } catch (userError) {
                    console.error('Błąd pobierania danych użytkownika:', userError);
                }
                navigate('/');//
            } else {
                throw new Error('Brak tokenu w odpowiedzi');
            }
        }
        else if (response.status === 401) {
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
