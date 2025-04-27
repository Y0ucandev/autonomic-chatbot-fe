
import { useNavigate } from 'react-router-dom';
import Style from './UserRegistration.module.scss'
import { useState } from 'react'
import { Field, Formik, ErrorMessage } from 'formik';
import BtnSecret from '../../../utils/secretBtn/BtnSecret'
import { useSecretPassword } from '../../../hooks/useSecretPassword'
import { handleRegistration } from '../../../services/handleRegistration';
import ErrorPopup from '../../../utils/errorPopup/ErrorPopup';
import { checkIfPasswordLeaked } from '../../../services/checkIfPasswordLeaked';
export type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    age: number;
};
const UserRegistration = () => {
    const navigate = useNavigate();
    const { passwordReveal, togglePasswordReveal } = useSecretPassword();
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = async (values: FormValues) => {
        const errors: { [key in keyof FormValues]?: string } = {};
        if (!values.name) {
            errors.name = 'Pole jest wymagane';
        }
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
        else if (values.password != values.confirmPassword) {
            errors.confirmPassword = 'Hasła nie są takie same';
        }
        if (!values.age) {
            errors.age = 'Podaj wiek';
        }
        if (!values.gender) {
            errors.gender = 'Wybierz płeć';
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
                initialValues={{ name: '', email: '', password: '', confirmPassword: '', gender: '', age: NaN }}
                validate={validateForm}
                onSubmit={(values, formikBag) => {
                    return handleRegistration(values, formikBag, setError, setShowPopup);
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
                        <h2 className={Style.subtitle}>Zarejestruj sie:</h2>
                        <div>
                            <p className={Style.description}>Uzupełnij poniższe dane by kontynuować.</p>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Imie</label>
                                <ErrorMessage className={Style.errorMessage} name="name" component="span" />
                                <Field className={Style.formField} type="text" name="name" />
                            </div>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Email</label>
                                <ErrorMessage className={Style.errorMessage} name="email" component="span" />
                                <Field className={Style.formField} type="email" name="email" placeholder='kowalski@hat.pl' />
                            </div>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Podaj hasło:</label>
                                {errors.password && touched.password && errors.password && <ErrorMessage className={Style.errorMessage} name="password"
                                    component="span" />}
                                <Field className={Style.formField} type={passwordReveal} name="password" />
                                <BtnSecret passwordReveal={passwordReveal} togglePasswordReveal={togglePasswordReveal} />
                            </div>

                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Powtórz hasło:</label>
                                {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword && <ErrorMessage className={Style.errorMessage} name="confirmPassword"
                                    component="span" />}
                                <Field className={Style.formField} type={passwordReveal} name="confirmPassword" />
                            </div>
                            <div >
                                <label className={Style.contents}>Podaj wiek: </label>
                                <Field className={Style.formField} type="number" min='1' max='99' name="age" />
                                <ErrorMessage className={Style.errorMessage} name="age" component="span" />
                            </div>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Wybierz pleć:</label>
                                <div className={Style.wrapCheck}>
                                    <Field
                                        id='male'
                                        name="gender"
                                        type="radio"
                                        value="male"
                                        className={`${Style.check}`}
                                    />
                                    <label htmlFor='male' className={Style.contentsSmall}>Mężczyzna
                                    </label>
                                    <Field
                                        id='female'
                                        className={`${Style.check}`}
                                        name="gender"
                                        type="radio"
                                        value="female"
                                    />
                                    <label htmlFor='female' className={`${Style.contentsSmall} `}>Kobieta</label>
                                    <Field
                                        id='other'
                                        className={`${Style.check}`}
                                        name="gender"
                                        type="radio"
                                        value="other"
                                    />
                                    <label htmlFor='other' className={Style.contentsSmall}>Inna</label>
                                    <ErrorMessage className={Style.errorMessage} name="gender" component="span" />
                                </div>
                            </div>
                            <div className={Style.wrapBtn}>
                                <button className={Style.subForm} type="button" onClick={() => {
                                    navigate('/Logowanie')
                                }}>
                                    Zaloguj się
                                </button>
                                <button className={Style.subForm} type="submit" disabled={isSubmitting || !isValid || !dirty}>
                                    Zarejestruj się
                                </button>
                            </div>
                            {error && <ErrorPopup error={error} />}
                            {showPopup &&
                                <div className={Style.popup}>
                                    <h3 className={Style.popupTitle}>Rejestracja zakończona sukcesem</h3>
                                    <p>Możesz teraz przejść do korzystania z aplikacji</p>
                                    <button className={Style.finish} type="button"
                                        onClick={() => { navigate('/') }}>
                                        Kontynuuj
                                    </button>
                                </div>}
                        </div>
                    </form>
                )}
            </Formik>
        </div >
    )
}
export default UserRegistration