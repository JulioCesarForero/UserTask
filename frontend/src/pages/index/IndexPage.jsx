
import { Formik, Form } from 'formik';
import { useSearchParams } from 'react-router';
import { useState } from 'react';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router';
import { Password } from 'primereact/password';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

import usePostForm from 'hooks/usePostForm';
export default function IndexPage() {
		const auth = useAuth();
	const app = useApp();
	const [searchParams] = useSearchParams();
	const [pageReady, setPageReady] = useState(true);
	const [rememberUser, setRememberUser] = useState(false);
	const formUrl = "auth/login";

	const formDefaultValues = {
		username: '',
		password: '',
	}

	const validationSchema = yup.object().shape({
		username: yup.string().required().label(`Username or Email`),
		password: yup.string().required().label(`Password`),
	});

	function afterSubmit(loginData){
		if (loginData.token) {
			auth.login(loginData.token);
			const returnUrl = searchParams.get('redirect') || '/home';
			app.navigate(returnUrl);
		}
		else if(loginData.nextpage){
			app.navigate(loginData.nextpage);
		}
	}

	function onError(errorMsg){
		app.flashMsg('Login', errorMsg, 'error');
	}

	const form = {
		formUrl, formDefaultValues, validationSchema, afterSubmit, onError
	}

	const { submitForm, formData, loading, errorMsg, setErrorMsg, inputClassName } = usePostForm(form);
	return (
		<main id="IndexPage" className="main-page">
<section className="page-section mb-4" >
    <div className="container-fluid">
        <div className="md:max-w-[400px] mx-auto gap-4">
            <div className="md:col-span-4 comp-grid" >
                <div className="card  nice-shadow-2" >
                    <div >
                        <div className="flex flex-col gap-5 text-center items-center mb-5">
                            <i className="pi pi-user text-primary" style={{'fontSize': '5rem'}} />
                            <div className="text-lg font-bold">User Login</div>
                        </div>
                        <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values, actions) => submitForm(values)}>
                            {(formik) =>
                            <Form  className="flex flex-col gap-2">
                                <IconField iconPosition="right">
                                <InputIcon  className="pi pi-user"></InputIcon>
                                <InputText name="username" id="username" label="Username Or Email" placeholder="Username Or Email" className={inputClassName(formik.errors?.username)} value={formik.values.username} onChange={formik.handleChange} required type="text" />
                                </IconField>
                                <Password name="password" id="password" className={inputClassName(formik.errors?.password)} value={formik.values.password} onChange={formik.handleChange} label="Password"  inputClassName="w-full" style={{display: 'block'}} feedback={false} toggleMask placeholder="Password"  required />
                                <div className="flex justify-between items-center my-2">
                                    <div className="flex gap-2 items-center">
                                        <Checkbox inputId="rememberme" checked={rememberUser} onChange={e => setRememberUser(e.checked)} />
                                        <label className="text-sm text-gray-500" htmlFor="rememberme">Remember Me</label>
                                    </div>
                                    <Link to="/index/forgotpassword" severity="danger">Reset Password?</Link>
                                    </div>
                                    <div className="text-center">
                                        <Button label="Login"  loading={loading} icon="pi pi-lock-open" className="p-button-lg p-button-raised w-full"  type="submit"></Button>
                                    </div>
                                </Form>
                                }
                                </Formik>
                                <div className="flex gap-3 items-center justify-between mt-5">
                                    <div className="text-gray-500 font-bold text-sm">
                                        Don't Have an Account?
                                    </div>
                                    <div className="text-right grow-1">
                                        <Link to="/register">
                                            <Button variant="text" severity="info" className="w-full" icon="pi pi-user" label="Register" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
		</main>
	);
}
