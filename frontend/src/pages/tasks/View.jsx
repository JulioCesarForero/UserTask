
import { Button } from 'primereact/button';
import { ExportPageData } from 'components/ExportPageData';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import TaskprioritiesViewPage from 'pages/taskpriorities/View';
import TasksEditPage from 'pages/tasks/Edit';
import TaskstatusesViewPage from 'pages/taskstatuses/View';
import useApp from 'hooks/useApp';
import UsersViewPage from 'pages/users/View';
import useUtils from 'hooks/useUtils';

import useViewPage from 'hooks/useViewPage';
const defaultProps = {
	id: null,
	primaryKey: 'task_id',
	pageName: 'tasks',
	apiPath: 'tasks/view',
	routeName: 'tasksview',
	msgBeforeDelete: "Are you sure you want to delete this record?",
	msgTitle: "Delete record",
	msgAfterDelete: "Record deleted successfully",
	showHeader: true,
	showFooter: true,
	exportData: true,
	isSubPage: false,
}

const TasksViewPage = (componentProps ) => {

	const props = {
		...defaultProps,
		...componentProps
	}
		const app = useApp();
	const utils = useUtils();
	const pageController = useViewPage(props);
	const { item, pageReady, loading, apiUrl, apiRequestError, deleteItem } = pageController;
	function ActionButton(data){
		const items = [
		{
			label: "Edit",
			command: (event) => { app.openPageDialog(<TasksEditPage isSubPage apiPath={`/tasks/edit/${data.task_id}`} />, {closeBtn: true }) },
			icon: "pi pi-pencil"
		},
		{
			label: "Delete",
			command: (event) => { deleteItem(data.task_id) },
			icon: "pi pi-trash"
		}
	]
		return (<Menubar className="p-0 " model={items} />);
	}
	function ExportData() {
		if (props.exportData) {
			const downloadFileName = `${utils.dateNow()}-tasks`;
			return (
				<ExportPageData print pageUrl={apiUrl} downloadFileName={downloadFileName} butonLabel="Export" tooltip="Export" buttonIcon="pi pi-print" />
			);
		}
	}

	function PageFooter() {
		if (props.showFooter) {
			return (
				<div className="flex gap-3">
					<ExportData />
	<div className="flex ">
	{ActionButton(item)}

	</div>
				</div>
			);
		}
	}
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}

	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}

	if(pageReady){
		return (
			<div>
<main id="TasksViewPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-4" >
        <div className="container-fluid">
            <div className="flex flex-wrap gap-4 items-center gap-4">
                { !props.isSubPage && 
                <div className="md:col-span-4 " >
                    <Button onClick={() => app.navigate(-1)} label=""  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                </div>
                }
                <div className="col-span-full " >
                    <Title title="Task Details"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-eye" avatarSize="large"    separator={false} />
                </div>
            </div>
        </div>
        <hr />
    </section>
    }
    <section className="page-section mb-4" >
        <div className="container-fluid">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-full comp-grid" >
                    <div >
                        {/*PageComponentStart*/}
                        <div className="mb-3 grid grid-cols-12 gap-4">
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Task Id</div>
                                        <div className="font-bold">{ item.task_id }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Title</div>
                                        <div className="font-bold">{ item.title }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Description</div>
                                        <div className="font-bold">{ item.description }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Related Entity Type</div>
                                        <div className="font-bold">{ item.related_entity_type }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Related Entity Id</div>
                                        <div className="font-bold">{ item.related_entity_id }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Assigned User Id</div>
                                        <div className="font-bold">{item.assigned_user_id && <Button className="p-button-text" icon="pi pi-eye" label="Users Detail" onClick={() => app.openPageDialog(<UsersViewPage isSubPage apiPath={`/users/view/${item.assigned_user_id}`} />, {closeBtn: true })} /> }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Priority Id</div>
                                        <div className="font-bold">{item.priority_id && <Button className="p-button-text" icon="pi pi-eye" label="Task Priorities Detail" onClick={() => app.openPageDialog(<TaskprioritiesViewPage isSubPage apiPath={`/taskpriorities/view/${item.priority_id}`} />, {closeBtn: true })} /> }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Due Date</div>
                                        <div className="font-bold">{ item.due_date }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Task Status Id</div>
                                        <div className="font-bold">{item.task_status_id && <Button className="p-button-text" icon="pi pi-eye" label="Task Statuses Detail" onClick={() => app.openPageDialog(<TaskstatusesViewPage isSubPage apiPath={`/taskstatuses/view/${item.task_status_id}`} />, {closeBtn: true })} /> }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Reminder Date</div>
                                        <div className="font-bold">{ item.reminder_date }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Completed At</div>
                                        <div className="font-bold">{ item.completed_at }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Created At</div>
                                        <div className="font-bold">{ item.created_at }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Updated At</div>
                                        <div className="font-bold">{ item.updated_at }</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*PageComponentEnd*/}
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

				<PageFooter />
			</div>
		);
	}
}
export default TasksViewPage;
