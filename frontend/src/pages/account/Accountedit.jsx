
import { Formik, Form, ErrorMessage } from 'formik';
import { useLocation } from 'react-router';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const defaultProps = {
	primaryKey: 'user_id',
	pageName: 'users',
	apiPath: 'account/edit',
	routeName: 'usersaccountedit',
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

const UsersAccounteditPage = (componentProps) => {

	const props = {
		...defaultProps,
		...componentProps
	}
		const app = useApp();
	const location = useLocation();
	// form validation schema
	const validationSchema = yup.object().shape({
		title: yup.string().nullable().label("Title"),
		first_name: yup.string().required().label("First Name"),
		last_name: yup.string().required().label("Last Name"),
		phone: yup.string().nullable().label("Phone"),
		username: yup.string().required().label("Username")
	});

	// form default values
	const formDefaultValues = {
		title: '', 
		first_name: '', 
		last_name: '', 
		phone: '', 
		username: '', 
	}

	//where page logics resides
	const pageController = useEditPage({ props, formDefaultValues, afterSubmit });
	//destructure and grab what we need
	const { formData, handleSubmit, submitForm, pageReady, loading, saving, apiRequestError, inputClassName } = pageController
	//Event raised on form submit success
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		window.location.reload();
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
<main id="UsersAccounteditPage" className="main-page">
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
                                                First Name *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="first_name"  onChange={formik.handleChange}  value={formik.values.first_name}   label="First Name" type="text" placeholder="Enter First Name"        className={inputClassName(formik?.errors?.first_name)} />
                                                <ErrorMessage name="first_name" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Last Name *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="last_name"  onChange={formik.handleChange}  value={formik.values.last_name}   label="Last Name" type="text" placeholder="Enter Last Name"        className={inputClassName(formik?.errors?.last_name)} />
                                                <ErrorMessage name="last_name" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Phone 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="phone"  onChange={formik.handleChange}  value={formik.values.phone}   label="Phone" type="text" placeholder="Enter Phone"        className={inputClassName(formik?.errors?.phone)} />
                                                <ErrorMessage name="phone" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Username *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <InputText name="username"  onChange={formik.handleChange}  value={formik.values.username}   label="Username" type="text" placeholder="Enter Username"        className={inputClassName(formik?.errors?.username)} />
                                                <ErrorMessage name="username" component="span" className="p-error" />
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
export default UsersAccounteditPage;
