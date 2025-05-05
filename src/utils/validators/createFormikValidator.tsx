import { ValidationSchema } from "./validators";

type AsyncValidator<T> = (value: T, allValues?: any) => Promise<string | undefined>;

export function createFormikValidate<T extends Record<string, any>>(
    schema: ValidationSchema<T>,
    asyncValidators?: { [K in keyof T]?: AsyncValidator<T[K]>[] }
) {
    return async function (values: T) {
        const errors: Partial<Record<keyof T, string>> = {};

        (Object.keys(schema) as Array<keyof T>).forEach(fieldName => {
            const fieldValidators = schema[fieldName] || [];
            for (const validator of fieldValidators) {
                const error = validator(values[fieldName], values);
                if (error) {
                    errors[fieldName] = error;
                    break;
                }
            }
        });

        if (asyncValidators) {
            const asyncPromises = (Object.keys(asyncValidators) as Array<keyof T>)
                .filter(fieldName => !errors[fieldName])
                .map(async fieldName => {
                    const fieldAsyncValidators = asyncValidators[fieldName] || [];

                    for (const validator of fieldAsyncValidators) {
                        try {
                            const error = await validator(values[fieldName], values);
                            if (error) {
                                errors[fieldName] = error;
                                break;
                            }
                        } catch (error) {
                            errors[fieldName] = "Błąd podczas walidacji";
                            break;
                        }
                    }
                });
            await Promise.all(asyncPromises);
        }
        return errors;
    };
}