
import { useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Title } from 'components/Title';
import NotesListPage from 'pages/notes/List';
import TasksListPage from 'pages/tasks/List';
import useApp from 'hooks/useApp';

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
		const notesFormData = { created_by:record?.user_id }
		app.setPageFormData('notes', notesFormData);

		// set  form data
		const tasksFormData = { assigned_user_id:record?.user_id }
		app.setPageFormData('tasks', tasksFormData);

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
        <TabPanel header={<Title title="User Notes"  headerClass="p-0" titleClass="text-lg font-bold"  iconClass="pi pi-th-large" avatarSize="small"    separator={false} />}>
            <div className="reset-grid">
                <NotesListPage isSubPage  fieldName="created_by" fieldValue={masterRecord.user_id} showBreadcrumbs={false} showHeader={false} showFooter={true}>
                </NotesListPage>
            </div>
        </TabPanel>
        <TabPanel header={<Title title="User Tasks"  headerClass="p-0" titleClass="text-lg font-bold"  iconClass="pi pi-th-large" avatarSize="small"    separator={false} />}>
            <div className="reset-grid">
                <TasksListPage isSubPage  fieldName="assigned_user_id" fieldValue={masterRecord.user_id} showBreadcrumbs={false} showHeader={false} showFooter={true}>
                </TasksListPage>
            </div>
        </TabPanel>
    </TabView>
</div>

		);
	}
}
export default MasterDetailPages;
