
import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router';
import { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { TabMenu } from 'primereact/tabmenu';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

import PageLoading from 'components/PageLoading';
const AccountViewPage = lazy(() => import('./Accountview'));
const AccountEditPage = lazy(() => import('./Accountedit'));
const ChangePassword = lazy(() => import('./ChangePassword'));
export default function Account(props) {
		const auth = useAuth();
	const app = useApp();
	const location = useLocation();
	let pageIndex = 0;
	const pathName = window.location.pathname || '';
	const pageName = pathName.split('/')[2] || '';
	if(pageName === 'edit'){
		pageIndex = 1;
	}
	else if(pageName === 'changepassword'){
		pageIndex = 2;
	}
	const [activeIndex, setActiveIndex] = useState(pageIndex);
	const accountMenuItems = [
		{
			label: "Account Detail", 
			icon: 'pi pi-fw pi-user', 
			command: () => app.navigate('/account')
		},
		{
			label:  "Edit Account", 
			icon: 'pi pi-fw pi-user-edit', 
			command: () => app.navigate('/account/edit')
		},
		{
			label: "Change Password", 
			icon: 'pi pi-fw pi-key', 
			command: () => app.navigate('/account/changepassword')
		},

	];
	return (
		<section className="page-section " >
			<div style={{minHeight:'100px'}}>
	<div className="mb-4 card surface-100">
		<div className="flex gap-3 items-center">
			<Avatar icon="pi pi-user" size="xlarge" shape="circle" />
			<div>
				<div className="text-2xl capitalize font-bold text-primary"> { auth.userName } </div>
				<div className="text-gray-500"> { auth.userEmail } </div>
			</div>
		</div>
	</div>

				<div className="card nice-shadow-2">
					<TabMenu model={accountMenuItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
					<div className="p-3">
						<Suspense fallback={<PageLoading />}>
							<Outlet />
							<Routes>
																<Route path="/" element={<AccountViewPage isSubPage />} />
								<Route path="/edit" element={<AccountEditPage isSubPage />} />
								<Route path="/changepassword" element={<ChangePassword isSubPage />} />
							</Routes>
						</Suspense>
					</div>
				</div>
			</div>
		</section>
	);
}
