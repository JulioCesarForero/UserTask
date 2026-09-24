
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { DataSource } from 'components/DataSource';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const defaultProps = {
	primaryKey: 'created_by',
	pageName: 'notes',
	apiPath: 'notes/add',
	routeName: 'notesadd',
	submitButtonLabel: "Submit",
	formValidationError: "Form is invalid",
	formValidationMsg: "Please complete the form",
	msgTitle: "Create Record",
	msgAfterSave: "Record added successfully",
	msgBeforeSave: "",
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}

const NotesAddPage = (componentProps) => {
	const props = {
		...defaultProps,
		...componentProps
	}
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		related_entity_type: yup.string().required().label("Related Entity Type"),
		related_entity_id: yup.number().required().label("Related Entity Id"),
		title: yup.string().nullable().label("Title"),
		content: yup.string().required().label("Content"),
		created_by: yup.string().required().label("Created By")
	});

	
	//form default values
	const formDefaultValues = {
		related_entity_type: '', 
		related_entity_id: '', 
		title: '', 
		content: '', 
		created_by: '', 
	}

	
	//page hook where logics resides
	const pageController =  useAddPage({ props, formDefaultValues, afterSubmit });

	
	// destructure and grab what the page needs
	const { formData, resetForm, handleSubmit, submitForm, pageReady, loading, saving, inputClassName } = pageController;
	
	//event raised after form submit
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		resetForm();
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigate(`/notes`);
		}

	}
	
	// page loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}

	
	//page has loaded any required data and ready to render
	if(pageReady){
		return (
<main id="NotesAddPage" className="main-page">
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
                    <Title title="Add Note"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-plus" avatarSize="large"    separator={false} />
                </div>
            </div>
        </div>
        <hr />
    </section>
    }
    <section className="page-section " >
        <div className="container-fluid">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-full md:col-span-7 comp-grid" >
                    <div >
                        <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values, actions) =>submitForm(values)}>
                            {(formik) => 
                            <>
                            <Form className={`${!props.isSubPage ? 'card nice-shadow-2 ' : ''}`}>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Related Entity Type *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="related_entity_type"  onChange={formik.handleChange}  value={formik.values.related_entity_type}   label="Related Entity Type" type="text" placeholder="Enter Related Entity Type"        className={inputClassName(formik?.errors?.related_entity_type)} />
                                                <ErrorMessage name="related_entity_type" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Related Entity Id *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="related_entity_id"  onChange={formik.handleChange}  value={formik.values.related_entity_id}   label="Related Entity Id" type="number" placeholder="Enter Related Entity Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.related_entity_id)} />
                                                <ErrorMessage name="related_entity_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Title 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="title"  onChange={formik.handleChange}  value={formik.values.title}   label="Title" type="text" placeholder="Enter Title"        className={inputClassName(formik?.errors?.title)} />
                                                <ErrorMessage name="title" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Content *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputTextarea name="content"  className={inputClassName(formik?.errors?.content)}   value={formik.values.content} placeholder="Enter Content" onChange={formik.handleChange}   >
                                                </InputTextarea>
                                                <ErrorMessage name="content" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Created By *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <DataSource   apiPath="components_data/created_by_option_list"  >
                                                    {
                                                    ({ response }) => 
                                                    <>
                                                    <Dropdown  name="created_by"     optionLabel="label" optionValue="value" value={formik.values.created_by} onChange={formik.handleChange} options={response} label="Created By"  placeholder="Select a value ..."  className={inputClassName(formik?.errors?.created_by)}   />
                                                    <ErrorMessage name="created_by" component="span" className="p-error" />
                                                    </>
                                                    }
                                                </DataSource>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { props.showFooter && 
                                <div className="text-center my-3">
                                    <Button onClick={(e) => handleSubmit(e, formik)} className="p-button-primary" type="submit" label="Submit" icon="pi pi-send" loading={saving} />
                                </div>
                                }
                            </Form>
                            </>
                            }
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
		);
	}
}

export default NotesAddPage;
