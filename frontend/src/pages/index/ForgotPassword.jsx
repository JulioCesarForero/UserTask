import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import useApp from 'hooks/useApp';

import usePostForm from 'hooks/usePostForm';
export default function ForgotPassword(){
		const app = useApp();

	const formUrl = "auth/forgotpassword";
	const formDefaultValues = {
		email: '',
	}
	const validationSchema = yup.object().shape({
		email: yup.string().required().label(`Email`),
	});

	function afterSubmit(message){
		app.flashMsg("Send password reset link", message, 'success');
	}

	function onError(errorMsg){
		app.showPageRequestError(errorMsg);
	}

	const form = { formUrl, formDefaultValues, validationSchema, afterSubmit,onError }

	const { submitForm, formData, loading, inputClassName } = usePostForm(form);

	return (
		<div className="md:max-w-[40%] mx-auto">
			<div className="card">
				<div className="flex items-center gap-4">
					<Button onClick={() => app.navigate(-1)} label="Login" text icon="pi pi-arrow-left"  />
					<div className="text-2xl font-bold">Password Reset </div>
				</div>
				<Divider />
				<div className="text-lg">Please provide the valid email address you used to register</div>
				<Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values) => submitForm(values)}>
					{(formik) =>
						<Form>
							<div className="flex flex-col gap-4">

								<div>
									<InputText id="email" name="email" inputClassName="w-full" className={inputClassName(formik.errors?.email)} value={formik.values.email} onChange={formik.handleChange} placeholder="Email" required type="email" />
									<ErrorMessage name="email" component="span" className="p-error" />
								</div>

								<div className="text-center">
									<Button loading={loading} type="submit" label="Send" icon="pi pi-envelope" />
								</div>
							</div>
						</Form>
					}
				</Formik>

				<Divider />
				<div className="text-primary">
					A link will be sent to your email containing the information you need for your password
				</div>
			</div>
		</div>
	);
}