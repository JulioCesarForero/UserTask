import { Formik, Form, ErrorMessage } from 'formik';
import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputOtp } from 'primereact/inputotp';
import { Message } from 'primereact/message';
import useApi from 'hooks/useApi';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

import usePostForm from 'hooks/usePostForm';
export default function VerifyOtp() {
		const auth = useAuth();
	const app = useApp();
	const api = useApi();
	const [searchParams] = useSearchParams();
	const [resending, setResending] = useState(false);
	const [canResend, setCanResend] = useState(false);
	const [countDown, setCountDown] = useState('');

	const formUrl = "/auth/validateotp";
	const token = searchParams.get("token");
	const formDefaultValues = {
		otp_code: "",
		token,
	}

	const validationSchema = yup.object().shape({
		otp_code: yup.string().required().label(`OTP Code`)
	});

	const form = {
		formUrl, formDefaultValues, validationSchema, afterSubmit
	}

	function afterSubmit(loginData) {
		if (loginData.token) {
			auth.login(loginData.token);
			app.navigate('/home'); //user is now logged in. Navigate to home page
		}
		else {
			app.navigate(loginData.nextpage)
		}
	}
	function startCountDown() {
		let duration = searchParams.get("duration");
		duration = parseInt(duration) || 5; // in minutes

		let minutes = 60 * duration;
		let timer = minutes;
		let seconds;
		const interval = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			setCountDown(minutes + ":" + seconds);

			if (--timer < 0) {
				clearInterval(interval);
				setErrorMsg("OTP has expired");
				setCanResend(true);
			}
		}, 1000);
	}

	async function resendOtp() {
		try{
			setResending(true);
			setErrorMsg(null);
			await api.post('/auth/resendotp', formData);
			setCanResend(false);
			startCountDown();
			app.flashMsg('Success', 'OTP Sent Successfully', 'success');
		}
		catch(error){
			app.showPageRequestError(error);
		}
		finally{
			setResending(false);
		}
	}

	useEffect(() => {
		startCountDown();
	}, [token]);

	const { formData, submitForm, loading, errorMsg, setErrorMsg, inputClassName } = usePostForm(form);

	return (
		<>
			<div className="md:max-w-[40%] mx-auto">
				<div className="card flex flex-col gap-3">
					<div className="mb-4">
						<div className="flex gap-4 items-center justify-between">
							<Avatar className="bg-green-500 text-white" icon="pi pi-check-circle" size="large" />
							<div className="text-2xl font-bold">OTP Verification</div>
							<div className="text-2xl font-bold text-info">{countDown}</div>
						</div>
						<div className="text-primary"></div>
					</div>
					<div className="text-center">{ errorMsg && <Message closable severity="error" text={errorMsg} />}</div>
					<Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values) => submitForm(values)}>
						{(formik) =>
							<Form>

								<div className="flex gap-4 justify-between">
									<div>
										<InputOtp name="otp_code" id="otp_code" className={inputClassName(formik?.errors?.otp_code)} value={formik.values.otp_code}
												  onChange={(event) => {
													  formik.setFieldValue('otp_code', event.value);
													  if (event.value?.length === 4) {
														  formik.submitForm();
													  }
												  }}
										/>
										<ErrorMessage name="otp_code" component="span" className="p-error" />
									</div>
									<Button loading={loading} type="submit" label="Verify" />
								</div>
								<Divider />
								<div className="flex items-center justify-between">
									<div className="text-gray-500">
										Didn't receive an OTP ?
									</div>
									<div>
										<Button text disabled={!canResend} loading={resending} onClick={()=>resendOtp()} type="button" label="Resend..." />
									</div>
								</div>
							</Form>
						}
					</Formik>
				</div>
			</div>

			<style>
				{
				`
				.otp-input {
					font-weight: bold;
					font-size: 20px;
					text-align: center;
					letter-spacing: 10px;
				}
				.otp-input::placeholder {
					font-weight: normal;
					font-size: 14px;
					text-align: center;
					letter-spacing: 1px;
				}
				`
			}
			</style>
		</>
	);
}
