
import { Button } from 'primereact/button';
import { ExportPageData } from 'components/ExportPageData';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import NotesEditPage from 'pages/notes/Edit';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import UsersViewPage from 'pages/users/View';
import useUtils from 'hooks/useUtils';

import useViewPage from 'hooks/useViewPage';
const defaultProps = {
	id: null,
	primaryKey: 'note_id',
	pageName: 'notes',
	apiPath: 'notes/view',
	routeName: 'notesview',
	msgBeforeDelete: "Are you sure you want to delete this record?",
	msgTitle: "Delete record",
	msgAfterDelete: "Record deleted successfully",
	showHeader: true,
	showFooter: true,
	exportData: true,
	isSubPage: false,
}

const NotesViewPage = (componentProps ) => {

	const props = {
		...defaultProps,
		...componentProps
	}
		const auth = useAuth();
	const app = useApp();
	const utils = useUtils();
	const pageController = useViewPage(props);
	const { item, pageReady, loading, apiUrl, apiRequestError, deleteItem } = pageController;
	function ActionButton(data){
		const items = [
		{
			label: "Edit",
			command: (event) => { app.openPageDialog(<NotesEditPage isSubPage apiPath={`/notes/edit/${data.note_id}`} />, {closeBtn: true }) },
			icon: "pi pi-pencil",
			visible: () => auth.canView('notes/edit')
		},
		{
			label: "Delete",
			command: (event) => { deleteItem(data.note_id) },
			icon: "pi pi-trash",
			visible: () => auth.canView('notes/delete')
		}
	]
	.filter((item) => {
		if(item.visible){
			return item.visible()
		}
		return true;
	});

		return (<Menubar className="p-0 " model={items} />);
	}
	function ExportData() {
		if (props.exportData) {
			const downloadFileName = `${utils.dateNow()}-notes`;
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
<main id="NotesViewPage" className="main-page">
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
                    <Title title="Note Details"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-eye" avatarSize="large"    separator={false} />
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
                                        <div className="text-gray-600 mb-1">Note Id</div>
                                        <div className="font-bold">{ item.note_id }</div>
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
                                        <div className="text-gray-600 mb-1">Title</div>
                                        <div className="font-bold">{ item.title }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Content</div>
                                        <div className="font-bold">{ item.content }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Created By</div>
                                        <div className="font-bold">{item.created_by && <Button className="p-button-text" icon="pi pi-eye" label="Users Detail" onClick={() => app.openPageDialog(<UsersViewPage isSubPage apiPath={`/users/view/${item.created_by}`} />, {closeBtn: true })} /> }</div>
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
export default NotesViewPage;
