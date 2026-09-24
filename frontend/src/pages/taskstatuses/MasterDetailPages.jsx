
import { useEffect } from 'react';
import { CanView } from 'components/Can';
import { TabView, TabPanel } from 'primereact/tabview';
import { Title } from 'components/Title';
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
		const tasksFormData = { task_status_id:record?.task_status_id }
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
        <TabPanel header={<Title title="Task Status Tasks"  headerClass="p-0" titleClass="text-lg font-bold"  iconClass="pi pi-th-large" avatarSize="small"    separator={false} />}>
            <CanView pagePath="tasks">
                <div className="reset-grid">
                    <TasksListPage isSubPage  fieldName="task_status_id" fieldValue={masterRecord.task_status_id} showBreadcrumbs={false} showHeader={false} showFooter={true}>
                    </TasksListPage>
                </div>
            </CanView>
        </TabPanel>
    </TabView>
</div>

		);
	}
}
export default MasterDetailPages;
