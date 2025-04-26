
import { useNavigate } from 'react-router-dom';
import Style from './UserRegistration.module.scss'
import { useState } from 'react'
import { Field, Formik, ErrorMessage } from 'formik';
type FormValues = {
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    age: number;
};
const UserRegistration = () => {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const passwordReveal = 'password'
    return (
        <div>
            <h1>Anywhere in your app!</h1>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '', gender: '', age: NaN }}
                validate={(values: FormValues) => {
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
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    isSubmitting,
                    isValid,
                    dirty
                }) => (
                    <form onSubmit={handleSubmit} className={Style.wrapForm}>
                        <h1 className={Style.title}>Autonomic Chat Bot</h1>
                        <h2 className={Style.description}>Zarejestruj sie:</h2>
                        <div>
                            <p className={Style.description}>Uzupełnij poniższe dane by kontynułować.</p>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Email</label>
                                <ErrorMessage className={Style.errorMessage} name="email" component="span" />
                                <Field className={Style.formField} type="email" name="email" />
                            </div>
                            <div className={Style.wrapInput}>
                                <label className={Style.contents}>Podaj hasło:</label>
                                <Field className={Style.formField} type={passwordReveal} name="password" />
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
                            <button className={Style.subForm} type="submit" disabled={isSubmitting || !isValid || !dirty}
                                onClick={() => {
                                    if (values.email && values.password && values.confirmPassword && values.age && values) {
                                        setShowPopup(true);
                                    }
                                }
                                }>
                                Zarejestruj się
                            </button>
                            {showPopup &&
                                <div className={Style.popup}>
                                    <h3 className={Style.popupTitle}>Rejestracja zakończona sukcesem</h3>
                                    <p>Możesz teraz przejść do korzystania z naszej aplikacji</p>
                                    <button className={Style.finish} type="button"
                                        onClick={() => {
                                            navigate('/');
                                        }
                                        }>
                                        Kontynuuj
                                    </button>
                                </div>}
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}
export default UserRegistration