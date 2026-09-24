
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { CheckDuplicate } from 'components/CheckDuplicate';
import { DataSource } from 'components/DataSource';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const defaultProps = {
	primaryKey: 'user_id',
	pageName: 'users',
	apiPath: 'users/add',
	routeName: 'usersadd',
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

const UsersAddPage = (componentProps) => {
	const props = {
		...defaultProps,
		...componentProps
	}
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		email: yup.string().email().required().label("Email"),
		phone: yup.string().nullable().label("Phone"),
		username: yup.string().required().label("Username"),
		password: yup.string().required().label("Password"),
		confirm_password: yup.string().required().label("Confirm Password").oneOf([yup.ref('password')], "Your passwords do not match"),
		user_role_id: yup.string().nullable().label("User Role Id")
	});

	
	//form default values
	const formDefaultValues = {
		email: '', 
		phone: '', 
		username: '', 
		password: '', 
		confirm_password: '', 
		user_role_id: '', 
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
			app.navigate(`/users`);
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
<main id="UsersAddPage" className="main-page">
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
                    <Title title="Add User"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-gray-500" iconClass="pi pi-plus" avatarSize="large"    separator={false} />
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
                                                Email *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <CheckDuplicate value={formik.values.email} apiPath="components_data/users_email_exist">
                                                { (checker) => 
                                                <>
                                                <InputText name="email" onBlur={checker.check} onChange={formik.handleChange}  value={formik.values.email}   label="Email" type="email" placeholder="Enter Email"        className={inputClassName(formik?.errors?.email)} />
                                                <ErrorMessage name="email" component="span" className="p-error" />
                                                {(!checker.loading && checker.exist) && <small className="p-error">Not available</small>}
                                                {checker.loading && <small className="text-gray-500">Checking...</small> }
                                                </>
                                                }
                                                </CheckDuplicate>
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
                                                <CheckDuplicate value={formik.values.username} apiPath="components_data/users_username_exist">
                                                { (checker) => 
                                                <>
                                                <InputText name="username" onBlur={checker.check} onChange={formik.handleChange}  value={formik.values.username}   label="Username" type="text" placeholder="Enter Username"        className={inputClassName(formik?.errors?.username)} />
                                                <ErrorMessage name="username" component="span" className="p-error" />
                                                {(!checker.loading && checker.exist) && <small className="p-error">Not available</small>}
                                                {checker.loading && <small className="text-gray-500">Checking...</small> }
                                                </>
                                                }
                                                </CheckDuplicate>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Password *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <Password name="password" value={formik.values.password} onChange={formik.handleChange} label="Password" placeholder="Enter Password"  inputClassName="w-full" style={{display: 'block'}} toggleMask feedback className={inputClassName(formik?.errors?.password)} />
                                                <ErrorMessage name="password" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                Confirm Password *
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <Password name="confirm_password" id="confirm_password" className={inputClassName(formik?.errors?.comfirm_password)} inputClassName="w-full" style={{display: 'block'}} feedback={false} toggleMask  value={formik.values.confirm_password} onChange={formik.handleChange} label="Confirm Password" placeholder="Confirm Password"  />
                                                <ErrorMessage name="confirm_password" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-full md:col-span-3">
                                                User Role Id 
                                            </div>
                                            <div className="col-span-full md:col-span-9">
                                                <DataSource   apiPath="components_data/user_role_id_option_list"  >
                                                    {
                                                    ({ response }) => 
                                                    <>
                                                    <Dropdown  name="user_role_id"     optionLabel="label" optionValue="value" value={formik.values.user_role_id} onChange={formik.handleChange} options={response} label="User Role Id"  placeholder="Select a value ..."  className={inputClassName(formik?.errors?.user_role_id)}   />
                                                    <ErrorMessage name="user_role_id" component="span" className="p-error" />
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

export default UsersAddPage;
