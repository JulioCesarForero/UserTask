
import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router';
import PageLoading from 'components/PageLoading';
import PageNotFound from 'pages/errors/PageNotFound';

const ForgotPasswordPage = lazy(()=>import('pages/index/ForgotPassword'));
const ResetPasswordPage = lazy(()=>import('pages/index/ResetPassword'));
const ResetPasswordCompletedPage = lazy(()=>import('pages/index/ResetPasswordCompleted'));
const RegisterPage = lazy(() => import('pages/index/RegisterPage'));

export default function IndexPages(props) {
    return (
        <Suspense fallback={<PageLoading />}>
            <Outlet />
            <Routes>
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/index/forgotpassword" element={<ForgotPasswordPage />} />
			<Route path="/index/resetpassword" element={<ResetPasswordPage />} />
			<Route path="/index/resetpassword_completed" element={<ResetPasswordCompletedPage />} />
				<Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
}
