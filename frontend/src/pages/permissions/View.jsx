
import { Button } from 'primereact/button';
import { ExportPageData } from 'components/ExportPageData';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import PermissionsEditPage from 'pages/permissions/Edit';
import RolesViewPage from 'pages/roles/View';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import useUtils from 'hooks/useUtils';

import useViewPage from 'hooks/useViewPage';
const defaultProps = {
	id: null,
	primaryKey: 'permission_id',
	pageName: 'permissions',
	apiPath: 'permissions/view',
	routeName: 'permissionsview',
	msgBeforeDelete: "Are you sure you want to delete this record?",
	msgTitle: "Delete record",
	msgAfterDelete: "Record deleted successfully",
	showHeader: true,
	showFooter: true,
	exportData: true,
	isSubPage: false,
}

const PermissionsViewPage = (componentProps ) => {

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
			command: (event) => { app.openPageDialog(<PermissionsEditPage isSubPage apiPath={`/permissions/edit/${data.permission_id}`} />, {closeBtn: true }) },
			icon: "pi pi-pencil",
			visible: () => auth.canView('permissions/edit')
		},
		{
			label: "Delete",
			command: (event) => { deleteItem(data.permission_id) },
			icon: "pi pi-trash",
			visible: () => auth.canView('permissions/delete')
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
			const downloadFileName = `${utils.dateNow()}-permissions`;
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
<main id="PermissionsViewPage" className="main-page">
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
                    <Title title="Permission Details"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-eye" avatarSize="large"    separator={false} />
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
                                        <div className="text-gray-600 mb-1">Permission Id</div>
                                        <div className="font-bold">{ item.permission_id }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Role Id</div>
                                        <div className="font-bold">{item.role_id && <Button className="p-button-text" icon="pi pi-eye" label="Roles Detail" onClick={() => app.openPageDialog(<RolesViewPage isSubPage apiPath={`/roles/view/${item.role_id}`} />, {closeBtn: true })} /> }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-4">
                                <div className="flex gap-2 items-center card p-3 nice-shadow-2">
                                    <div>
                                        <div className="text-gray-600 mb-1">Permission</div>
                                        <div className="font-bold">{ item.permission }</div>
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
export default PermissionsViewPage;
