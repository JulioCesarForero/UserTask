
import { useEffect } from 'react';
import { CanView } from 'components/Can';
import { TabView, TabPanel } from 'primereact/tabview';
import { Title } from 'components/Title';
import PermissionsListPage from 'pages/permissions/List';
import useApp from 'hooks/useApp';
import UsersListPage from 'pages/users/List';

const MasterDetailPages = (props) => {
		const app = useApp();
	const { masterRecord, scrollIntoView = true } = props;

	const activeTab = 0;
	function scrollToDetailPage() {
		if (scrollIntoView) {
			const pageElement = document.getElementById('master-detailpage');
			if(pageElement){
				pageElement.scrollIntoView({behavior:'smooth', block:'start'});
			}
		}
	}

	// pass form data from master to detail
	function setDetailPageFormData(){
		const record = masterRecord;
		// set  form data
		const permissionsFormData = { role_id:record?.role_id }
		app.setPageFormData('permissions', permissionsFormData);

		// set  form data
		const usersFormData = { user_role_id:record?.role_id }
		app.setPageFormData('users', usersFormData);

	}

	// pass form data from master to detail
	useEffect(() => {
		scrollToDetailPage();
		setDetailPageFormData();
	}, [masterRecord]);
	if(masterRecord){
		return (
<div id="master-detailpage">
    <TabView value={activeTab}>
        <TabPanel header={<Title title="Role Permissions"  headerClass="p-0" titleClass="text-lg font-bold"  iconClass="pi pi-th-large" avatarSize="small"    separator={false} />}>
            <CanView pagePath="permissions">
                <div className="reset-grid">
                    <PermissionsListPage isSubPage  fieldName="role_id" fieldValue={masterRecord.role_id} showBreadcrumbs={false} showHeader={false} showFooter={true}>
                    </PermissionsListPage>
                </div>
            </CanView>
        </TabPanel>
        <TabPanel header={<Title title="Role Users"  headerClass="p-0" titleClass="text-lg font-bold"  iconClass="pi pi-th-large" avatarSize="small"    separator={false} />}>
            <CanView pagePath="users">
                <div className="reset-grid">
                    <UsersListPage isSubPage  fieldName="user_role_id" fieldValue={masterRecord.role_id} showBreadcrumbs={false} showHeader={false} showFooter={true}>
                    </UsersListPage>
                </div>
            </CanView>
        </TabPanel>
    </TabView>
</div>

		);
	}
}
export default MasterDetailPages;
