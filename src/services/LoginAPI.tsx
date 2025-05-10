import { FormValues } from "../components/loginPage/userLogin/UserLogin";
import { api } from "../config/api";

type LoginResponse = {
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

        const response = await fetch(`${api.apiInterceptor}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            })
        });

        switch (response.status) {
            case 200:
                const data: LoginResponse = await response.json();

                if (data.access_token) {
                    localStorage.setItem('accessToken', data.access_token);

                    try {
                        const userResponse = await fetch(`${api.apiInterceptor}/users/me`, {
                            headers: {
                                'Authorization': `Bearer ${data.access_token}`
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            setUser(userData);
                        }
                    } catch (userError) {
                        console.error('Error getting user data:', userError);
                    }
                    navigate('/Uzytkownik');

                } else {
                    throw new Error('No token in response');
                }
                break;

            case 401:
                setError('Registration error, missing or incorrect registration data');
                break;

            default:
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration error');
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
