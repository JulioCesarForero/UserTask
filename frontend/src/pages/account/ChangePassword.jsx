
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import useApp from 'hooks/useApp';

import usePostForm from 'hooks/usePostForm';
export default function ChangePassword() {
		const app = useApp();
	const formUrl = "account/changepassword";

	const formDefaultValues = {
		oldpassword: '', 
		newpassword: '', 
		confirmpassword: '',
	}

	const validationSchema = yup.object().shape({
		oldpassword: yup.string().required().label(`Old Password`),
		newpassword: yup.string().required().label(`New Password`),
		confirmpassword: yup.string().required().label(`Confirm Password`).oneOf([yup.ref('newpassword')], 'Your passwords do not match.'),
	});

	function afterSubmit(data) {
		app.flashMsg('Change Password', 'Password change completed', 'success');
	}

	const form = {
		formUrl, formDefaultValues, validationSchema, afterSubmit
	}

	const { submitForm, formData, loading, errorMsg, inputClassName } = usePostForm(form);

	return (
		<div className="container">
			<div className="grid grid-cols-12">
				<div className="col-span-full md:col-span-7">
					<div className="text-2xl font-bold text-primary mb-3">Change Password</div>
					{errorMsg && <Message className="my-3" severity="error" text={errorMsg} /> }
					<Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values) => submitForm(values)}>
						{(formik) =>
							<Form>
								<div className="p-field mb-3">
									<Password inputClassName="w-full"
									className={inputClassName(formik?.errors?.oldpassword)} name="oldpassword" id="oldpassword" feedback={false} toggleMask value={formik.values.oldpassword} onChange={formik.handleChange} label="Current Password"  placeholder="Current Password"  style={{display:'block'}} />
									<ErrorMessage name="oldpassword" component="span" className="p-error" />
								</div>

								<div className="p-field mb-3">
									<Password inputClassName="w-full"
									className={inputClassName(formik?.errors?.newpassword)} name="newpassword" id="newpassword" feedback toggleMask value={formik.values.newpassword} onChange={formik.handleChange} label="New Password"  placeholder="New Password"  style={{display:'block'}} />
									<ErrorMessage name="newpassword" component="span" className="p-error" />
								</div>

								<div className="p-field mb-3">
									<Password inputClassName="w-full"
									className={inputClassName(formik?.errors?.confirmpassword)}  name="confirmpassword" id="confirmpassword" feedback={false} toggleMask value={formik.values.confirmpassword} onChange={formik.handleChange} label="Confirm new password"  placeholder="Confirm new password"  style={{display:'block'}} />
									<ErrorMessage name="confirmpassword" component="span" className="p-error" />
								</div>

								<div className="text-center">
									<Button type="submit" loading={loading} label="Change Password" />
								</div>
							</Form>
						}
					</Formik>
				</div>
			</div>
		</div>
	)
}
