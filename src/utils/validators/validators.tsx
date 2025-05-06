import { checkIfPasswordLeaked } from "../../services/checkIfPasswordLeaked";

export type Validator<T> = (value: T, allValues?: any) => string | undefined;
export type AsyncValidator<T> = (value: T, allValues?: any) => Promise<string | undefined>;
export type ValidationSchema<T> = { [K in keyof T]?: Validator<T[K]>[]; };

export const required = (message = 'Pole jest wymagane'): Validator<any> =>
    (value) => value ? undefined : message;

export const email = (message = 'Niepoprawny adres email'): Validator<string> =>
    (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? undefined : message;

export const password = (message = 'Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny'): Validator<string> =>
    (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value) ? undefined : message;

export const confirmPassword = (passwordFieldName: string, message = 'Hasła nie są takie same'): Validator<string> =>
    (value, allValues) => value && allValues && value === allValues[passwordFieldName] ? undefined : message;

export const passwordLeak = (): AsyncValidator<string> => {
    return async (value) => {
        if (!value) return undefined;
        try {
            const result = await checkIfPasswordLeaked(value);
            if (result.leaked) {
                return `To hasło wyciekło ${result.count} razy. Wybierz inne hasło.`;
            }
            return undefined;
        } catch (error) {
            console.error("Błąd podczas sprawdzania wycieku hasła:", error);
            return "Nie udało się sprawdzić bezpieczeństwa hasła";
        }
    }
}