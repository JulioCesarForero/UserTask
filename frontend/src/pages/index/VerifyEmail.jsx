
import { useSearchParams } from 'react-router';
import { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import useApi from 'hooks/useApi';
import useApp from 'hooks/useApp';


export default function VerifyEmail(){
		const app = useApp();
	const api = useApi();
	const [searchParams] = useSearchParams();
	const formUrl = "auth/resendverifyemail";

	const [loading, setLoading] = useState(false);

	let token = searchParams.get("token");

	async function resendEmail() {
		try {
			setLoading(true);
			await api.post(formUrl, {token});
			app.flashMsg("Resend Verification Email", "Email verification link sent to your mailbox", 'success');
		} catch (err) {
			app.showPageRequestError(err);
		}
		finally {
			setLoading(false);
		}
	}

	return (
		<div className="md:max-w-[60%] mx-auto">
			<div className="card text-center">
				<Avatar className="bg-green-700 text-green-100" size="large" icon="pi pi-check-circle" />
				<div className="text-2xl mt-3  font-bold text-green-500">Email verification link sent to your mailbox</div>
				<div className="text-gray-500">Please verify your email address by following the link in your mailbox</div>
				<Divider />
				<Button label="Resend Email" onClick={() => resendEmail() } icon="pi pi-envelope" loading={loading} />
			</div>
		</div>
	);
}
