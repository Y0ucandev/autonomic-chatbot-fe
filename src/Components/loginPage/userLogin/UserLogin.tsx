import { useSecretPassword } from '../../../hooks/useSecretPassword';
import { checkIfPasswordLeaked } from '../../../services/checkIfPasswordLeaked';
import BtnSecret from '../../../utils/secretBtn/BtnSecret';
import Style from './UserLogin.module.scss'
import { useState } from 'react'
import { Field, Formik, ErrorMessage } from 'formik';
import { loginAPI } from '../../../services/LoginAPI';
import ErrorPopup from '../../../utils/errorPopup/ErrorPopup';
import { useNavigate } from 'react-router-dom';
import hiIcon from '../../../assets/Animation/ChatInlog.gif';
export type FormValues = {
    email: string;
    password: string;
};
const UserLogin = () => {
    const navigate = useNavigate();
    const { passwordReveal, togglePasswordReveal } = useSecretPassword();
    const [error, setError] = useState<string | null>(null);
    const validateForm = async (values: FormValues) => {
        const errors: { [key in keyof FormValues]?: string } = {};

        if (!values.email) {
            errors.email = 'Pole jest wymagane';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = 'Niepoprawny adres email';
        }
        if (!values.password) {
            errors.password = 'Pole jest wymagane';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(values.password)) {
            errors.password = "Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny";
        }
        if (values.password && !errors.password) {
            try {
                const result = await checkIfPasswordLeaked(values.password);
                if (result.leaked) {
                    errors.password = `To hasło wyciekło ${result.count} razy. Wybierz inne hasło.`;
                }
            } catch (error) {
                console.error("Błąd podczas sprawdzania wycieku hasła:", error);
                errors.password = "Nie udało się sprawdzić bezpieczeństwa hasła";
            }
        }
        return errors;
    }
    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={validateForm}
                onSubmit={(values, formikBag) => {
                    return loginAPI(values, formikBag, setError, navigate);
                }}
            >
                {({
                    errors,
                    touched,
                    handleSubmit,
                    isSubmitting,
                    isValid,
                    dirty
                }) => (
                    <form onSubmit={handleSubmit} className={Style.wrapForm}>
                        <h1 className={Style.title}>Autonomic Chat Bot</h1>
                        <div className={Style.wrapHiIcon}>
                            <h2 className={Style.subtitle}>Zaloguj sie:</h2>
                            <img className={Style.hiIcon} src={hiIcon} alt="" />
                        </div>
                        <div className={Style.wrapInput}>
                            <div className={Style.input}>
                                <label className={Style.contents}>Email</label>
                                <ErrorMessage className={Style.errorMessage} name="email" component="span" />
                                <Field className={Style.formField} type="email" name="email" placeholder='kowalski@hat.pl' />
                            </div>
                            <div className={Style.input}>
                                <label className={Style.contents}>Podaj hasło:</label>
                                {errors.password && touched.password && errors.password && <ErrorMessage className={Style.errorMessage} name="password"
                                    component="span" />}
                                <Field className={Style.formField} type={passwordReveal} name="password" />
                                <BtnSecret passwordReveal={passwordReveal} togglePasswordReveal={togglePasswordReveal} />
                            </div>
                        </div>
                        <div className={Style.wrapBtn}>
                            <button className={Style.subForm} type="button" onClick={() => {
                                navigate('/Rejestracja')
                            }}>
                                Zarejestruj się
                            </button>
                            <button className={Style.subForm} type="submit" disabled={isSubmitting || !isValid || !dirty}>
                                Zaloguj
                            </button>
                        </div>
                        {error && <ErrorPopup error={error} />}
                    </form>
                )
                }
            </Formik >
        </div >
    )
}
export default UserLogin