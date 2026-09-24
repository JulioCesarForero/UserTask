import { Formik, Form, ErrorMessage } from 'formik';
import { useSearchParams } from 'react-router';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import useApp from 'hooks/useApp';

import usePostForm from 'hooks/usePostForm';
export default function ResetPassword() {
		const app = useApp();
	const [searchParams] = useSearchParams();

	const formUrl = "auth/resetpassword";

	let token = searchParams.get("token");

	const formDefaultValues = {
		password: "",
		confirm_password: "",
		token,
	}

	const validationSchema = yup.object().shape({
		password: yup.string().required().label("Password"),
		confirm_password: yup.string().required().label("Confirm Password").oneOf([yup.ref('password')], "Your passwords do not match."),
	});

	function afterSubmit(data) {
		app.navigate("/index/resetpassword_completed");
	}

	function onError(errorMsg){
		app.showPageRequestError(errorMsg);
	}

	const form = { formUrl, formDefaultValues, validationSchema, afterSubmit, onError }

	const { formData, submitForm, loading, inputClassName } = usePostForm(form);

	return (
		<div className="md:max-w-[50%] mx-auto">
			<div className="card">
				<div className="flex gap-4 flex-wrap mb-4 items-center">
					<Button onClick={() => app.navigate('/')} label="Login" text icon="pi pi-arrow-left"  />
					<div className="text-2xl font-bold">Password Reset </div>
				</div>
				<Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values) => submitForm(values)}>
					{(formik) =>
						<Form>
							<div className="mb-3">
								<Password style={{display: 'block'}} inputClassName="w-full" className={inputClassName(formik?.errors?.password)} name="password" id="password" feedback toggleMask value={formik.values.password} onChange={formik.handleChange} placeholder="New Password" />
								<ErrorMessage name="password" component="span" className="p-error" />
							</div>

							<div className="mb-3">
								<Password style={{display: 'block'}} inputClassName="w-full" className={inputClassName(formik?.errors?.confirm_password)} name="confirm_password" id="confirm_password" feedback={false} toggleMask value={formik.values.confirm_password} onChange={formik.handleChange} placeholder="Confirm new password" />
								<ErrorMessage name="confirm_password" component="span" className="p-error" />
							</div>
							<div className="text-center">
								<Button type="submit" loading={loading} label="Change Password" />
							</div>
						</Form>
					}
				</Formik>
			</div>
		</div >
	);
}