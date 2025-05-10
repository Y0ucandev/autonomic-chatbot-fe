import { useState, useCallback } from 'react';
import { ValidationSchema } from "../utils/validators/validators";

export function useFormValidation<T extends Record<string, any>>(
    initialValues: T,
    validationSchema: ValidationSchema<T>
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const validateField = useCallback(async (name: keyof T) => {
        const fieldValidators = validationSchema[name] || [];
        const value = values[name];

        for (const validator of fieldValidators) {
            if (typeof validator === 'function' && !validator.toString().includes('async')) {
                const error = validator(value, values);
                if (error) {
                    setErrors(prev => ({ ...prev, [name]: error }));
                    return error;
                }
            }
        }
        for (const validator of fieldValidators) {
            if (typeof validator === 'function' && validator.toString().includes('async')) {
                try {
                    const error = await validator(value, values);
                    if (error) {
                        setErrors(prev => ({ ...prev, [name]: error }));
                        return error;
                    }
                } catch (error) {
                    const errorMessage = "Error during validation";
                    setErrors(prev => ({ ...prev, [name]: errorMessage }));
                    return errorMessage;
                }
            }
        }

        setErrors(prev => ({ ...prev, [name]: undefined }));
        return undefined;
    }, [values, validationSchema]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        validateField(name as keyof T);
    }, [validateField]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
        return async (e: React.FormEvent) => {
            e.preventDefault();
            let hasErrors = false;

            const validationPromises = Object.keys(validationSchema).map(async (key) => {
                const error = await validateField(key as keyof T);
                if (error) hasErrors = true;
            });
            await Promise.all(validationPromises);
            if (!hasErrors) {
                onSubmit(values);
            }
        };
    }, [values, validationSchema, validateField]);

    return {
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
    };
}