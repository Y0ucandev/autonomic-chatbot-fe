import { useSecretPassword } from '../../../hooks/useSecretPassword';
import BtnSecret from '../../../utils/secretBtn/BtnSecret';
import Style from './UserLogin.module.scss'
import { useState } from 'react'
import { Field, Formik, ErrorMessage } from 'formik';
import { loginAPI } from "../../../services/LoginAPI";
import ErrorPopup from '../../../utils/errorPopup/ErrorPopup';
import { useNavigate } from 'react-router-dom';
import hiIcon from '../../../assets/Animation/ChatInlog.gif';
import useAuth from '../../../hooks/useAuth';
import { AsyncValidator, email, password, passwordLeak, required, ValidationSchema } from '../../../utils/validators/validators';
import { createFormikValidate } from '../../../utils/validators/createFormikValidator'

export type FormValues = {
    email: string;
    password: string;
};

const UserLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const { passwordReveal, togglePasswordReveal } = useSecretPassword();

    const validationSchema: ValidationSchema<FormValues> = {
        email: [required(), email()],
        password: [required(), password()],
    };
    const asyncValidators: { [K in keyof FormValues]?: AsyncValidator<FormValues[K]>[] } = {
        password: [passwordLeak()]
    };
    const validate = createFormikValidate(validationSchema, asyncValidators);

    return (
        <div>
            <Formik
                initialValues={{ email: 'jann@wp.pl', password: 'Amnonte!1' }}
                // initialValues={{ email: '', password: '' }}
                validate={validate}
                onSubmit={(values, formikBag) => {
                    return loginAPI(values, formikBag, setError, navigate, setUser,);
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