
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataSource } from 'components/DataSource';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const defaultProps = {
	primaryKey: 'task_id',
	pageName: 'tasks',
	apiPath: 'tasks/edit',
	routeName: 'tasksedit',
	submitButtonLabel: "Update",
	formValidationError: "Form is invalid",
	formValidationMsg: "Please complete the form",
	msgTitle: "Update Record",
	msgAfterSave: "Record updated successfully",
	msgBeforeSave: "",
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}

const TasksEditPage = (componentProps) => {

	const props = {
		...defaultProps,
		...componentProps
	}
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		title: yup.string().required().label("Title"),
		description: yup.string().nullable().label("Description"),
		related_entity_type: yup.string().nullable().label("Related Entity Type"),
		related_entity_id: yup.number().nullable().label("Related Entity Id"),
		assigned_user_id: yup.string().nullable().label("Assigned User Id"),
		priority_id: yup.string().nullable().label("Priority Id"),
		due_date: yup.string().nullable().label("Due Date"),
		task_status_id: yup.string().nullable().label("Task Status Id"),
		reminder_date: yup.string().nullable().label("Reminder Date"),
		completed_at: yup.string().nullable().label("Completed At")
	});

	// form default values
	const formDefaultValues = {
		title: '', 
		description: '', 
		related_entity_type: '', 
		related_entity_id: '', 
		assigned_user_id: '', 
		priority_id: '', 
		due_date: new Date(), 
		task_status_id: '', 
		reminder_date: new Date(), 
		completed_at: new Date(), 
	}

	//where page logics resides
	const pageController = useEditPage({ props, formDefaultValues, afterSubmit });
	//destructure and grab what we need
	const { formData, handleSubmit, submitForm, pageReady, loading, saving, apiRequestError, inputClassName } = pageController
	//Event raised on form submit success
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigate(`/tasks`);
		}

	}
	// loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	//display error page 
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}

	//page is ready when formdata loaded successfully
	if(pageReady){
		return (
<main id="TasksEditPage" className="main-page">
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
                    <Title title="Edit Task"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-pencil" avatarSize="large"    separator={false} />
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
                        <Formik
                            initialValues={formData}
                            validationSchema={validationSchema} 
                            onSubmit={(values, actions) => {
                            submitForm(values);
                            }
                            }
                            >
                            { (formik) => {
                            return (
                            <Form className={`${!props.isSubPage ? 'card nice-shadow-2 ' : ''}`}>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Title *
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
                                                Description 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputTextarea name="description"  className={inputClassName(formik?.errors?.description)}   value={formik.values.description} placeholder="Enter Description" onChange={formik.handleChange}   >
                                                </InputTextarea>
                                                <ErrorMessage name="description" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Related Entity Type 
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
                                                Related Entity Id 
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
                                                Assigned User Id 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <DataSource   apiPath="components_data/created_by_option_list"  >
                                                    {
                                                    ({ response }) => 
                                                    <>
                                                    <Dropdown  name="assigned_user_id"     optionLabel="label" optionValue="value" value={formik.values.assigned_user_id} onChange={formik.handleChange} options={response} label="Assigned User Id"  placeholder="Select a value ..."  className={inputClassName(formik?.errors?.assigned_user_id)}   />
                                                    <ErrorMessage name="assigned_user_id" component="span" className="p-error" />
                                                    </>
                                                    }
                                                </DataSource>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Priority Id 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <DataSource   apiPath="components_data/priority_id_option_list"  >
                                                    {
                                                    ({ response }) => 
                                                    <>
                                                    <Dropdown  name="priority_id"     optionLabel="label" optionValue="value" value={formik.values.priority_id} onChange={formik.handleChange} options={response} label="Priority Id"  placeholder="Select a value ..."  className={inputClassName(formik?.errors?.priority_id)}   />
                                                    <ErrorMessage name="priority_id" component="span" className="p-error" />
                                                    </>
                                                    }
                                                </DataSource>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Due Date 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <Calendar name="due_date" showButtonBar className={inputClassName(formik?.errors?.due_date)} dateFormat="yy-mm-dd" value={formik.values.due_date} onChange={formik.handleChange} showIcon        />
                                                <ErrorMessage name="due_date" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Task Status Id 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <DataSource   apiPath="components_data/task_status_id_option_list"  >
                                                    {
                                                    ({ response }) => 
                                                    <>
                                                    <Dropdown  name="task_status_id"     optionLabel="label" optionValue="value" value={formik.values.task_status_id} onChange={formik.handleChange} options={response} label="Task Status Id"  placeholder="Select a value ..."  className={inputClassName(formik?.errors?.task_status_id)}   />
                                                    <ErrorMessage name="task_status_id" component="span" className="p-error" />
                                                    </>
                                                    }
                                                </DataSource>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Reminder Date 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <Calendar name="reminder_date" showButtonBar className={inputClassName(formik?.errors?.reminder_date)} dateFormat="yy-mm-dd" value={formik.values.reminder_date} onChange={formik.handleChange} showIcon        />
                                                <ErrorMessage name="reminder_date" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Completed At 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <Calendar name="completed_at" showButtonBar className={inputClassName(formik?.errors?.completed_at)} dateFormat="yy-mm-dd" value={formik.values.completed_at} onChange={formik.handleChange} showIcon        />
                                                <ErrorMessage name="completed_at" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { props.showFooter && 
                                <div className="text-center my-3">
                                    <Button onClick={(e) => handleSubmit(e, formik)}  type="submit" label="Update" icon="pi pi-send" loading={saving} />
                                </div>
                                }
                            </Form>
                            );
                            }
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
export default TasksEditPage;
