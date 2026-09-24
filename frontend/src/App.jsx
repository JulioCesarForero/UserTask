
import { Routes, Route, Navigate } from 'react-router';
import useAuth from 'hooks/useAuth';


import IndexLayout from 'layouts/IndexLayout';
import MainLayout from 'layouts/MainLayout';
import AuthRoutes from 'components/AuthRoutes';
import IndexPage from 'pages/index/IndexPage';
import NotesList from 'src/pages/notes/List';
import NotesView from 'src/pages/notes/View';
import NotesAdd from 'src/pages/notes/Add';
import NotesEdit from 'src/pages/notes/Edit';
import PermissionsList from 'src/pages/permissions/List';
import PermissionsView from 'src/pages/permissions/View';
import PermissionsAdd from 'src/pages/permissions/Add';
import PermissionsEdit from 'src/pages/permissions/Edit';
import RolesList from 'src/pages/roles/List';
import RolesView from 'src/pages/roles/View';
import RolesAdd from 'src/pages/roles/Add';
import RolesEdit from 'src/pages/roles/Edit';
import SysdiagramsList from 'src/pages/sysdiagrams/List';
import SysdiagramsView from 'src/pages/sysdiagrams/View';
import SysdiagramsAdd from 'src/pages/sysdiagrams/Add';
import SysdiagramsEdit from 'src/pages/sysdiagrams/Edit';
import TaskprioritiesList from 'src/pages/taskpriorities/List';
import TaskprioritiesView from 'src/pages/taskpriorities/View';
import TaskprioritiesAdd from 'src/pages/taskpriorities/Add';
import TaskprioritiesEdit from 'src/pages/taskpriorities/Edit';
import TasksList from 'src/pages/tasks/List';
import TasksView from 'src/pages/tasks/View';
import TasksAdd from 'src/pages/tasks/Add';
import TasksEdit from 'src/pages/tasks/Edit';
import TaskstatusesList from 'src/pages/taskstatuses/List';
import TaskstatusesView from 'src/pages/taskstatuses/View';
import TaskstatusesAdd from 'src/pages/taskstatuses/Add';
import TaskstatusesEdit from 'src/pages/taskstatuses/Edit';
import UsersList from 'src/pages/users/List';
import UsersView from 'src/pages/users/View';
import UsersAdd from 'src/pages/users/Add';
import UsersEdit from 'src/pages/users/Edit';
import AccountPages from 'src/pages/account';

import HomePage from 'pages/home/HomePage';
import IndexPages from 'pages/index';
import ErrorPages from 'pages/errors';

import 'primereact/resources/themes/viva-dark/theme.css';
import 'assets/styles/layout.scss';
import 'src/index.scss';

const App = () => {
	const auth = useAuth();
	function DefaultPage(){
		if(!auth.isLoggedIn){
			return <IndexPage />
		}
		return <Navigate to="/home" replace />;
	}
	return (
		<Routes>
			<Route exact element={<AuthRoutes />}>
			<Route element={<MainLayout />}>
				<Route path="/home" element={<HomePage />} />
				

				{/* notes pages routes */}
				<Route path="/notes" element={<NotesList />} />
				<Route path="/notes/:fieldName/:fieldValue" element={<NotesList />} />
				<Route path="/notes/index/:fieldName/:fieldValue" element={<NotesList />} />
				<Route path="/notes/view/:pageid" element={<NotesView />} />
				<Route path="/notes/add" element={<NotesAdd />} />
				<Route path="/notes/edit/:pageid" element={<NotesEdit />} />

				{/* permissions pages routes */}
				<Route path="/permissions" element={<PermissionsList />} />
				<Route path="/permissions/:fieldName/:fieldValue" element={<PermissionsList />} />
				<Route path="/permissions/index/:fieldName/:fieldValue" element={<PermissionsList />} />
				<Route path="/permissions/view/:pageid" element={<PermissionsView />} />
				<Route path="/permissions/add" element={<PermissionsAdd />} />
				<Route path="/permissions/edit/:pageid" element={<PermissionsEdit />} />

				{/* roles pages routes */}
				<Route path="/roles" element={<RolesList />} />
				<Route path="/roles/:fieldName/:fieldValue" element={<RolesList />} />
				<Route path="/roles/index/:fieldName/:fieldValue" element={<RolesList />} />
				<Route path="/roles/view/:pageid" element={<RolesView />} />
				<Route path="/roles/add" element={<RolesAdd />} />
				<Route path="/roles/edit/:pageid" element={<RolesEdit />} />

				{/* sysdiagrams pages routes */}
				<Route path="/sysdiagrams" element={<SysdiagramsList />} />
				<Route path="/sysdiagrams/:fieldName/:fieldValue" element={<SysdiagramsList />} />
				<Route path="/sysdiagrams/index/:fieldName/:fieldValue" element={<SysdiagramsList />} />
				<Route path="/sysdiagrams/view/:pageid" element={<SysdiagramsView />} />
				<Route path="/sysdiagrams/add" element={<SysdiagramsAdd />} />
				<Route path="/sysdiagrams/edit/:pageid" element={<SysdiagramsEdit />} />

				{/* taskpriorities pages routes */}
				<Route path="/taskpriorities" element={<TaskprioritiesList />} />
				<Route path="/taskpriorities/:fieldName/:fieldValue" element={<TaskprioritiesList />} />
				<Route path="/taskpriorities/index/:fieldName/:fieldValue" element={<TaskprioritiesList />} />
				<Route path="/taskpriorities/view/:pageid" element={<TaskprioritiesView />} />
				<Route path="/taskpriorities/add" element={<TaskprioritiesAdd />} />
				<Route path="/taskpriorities/edit/:pageid" element={<TaskprioritiesEdit />} />

				{/* tasks pages routes */}
				<Route path="/tasks" element={<TasksList />} />
				<Route path="/tasks/:fieldName/:fieldValue" element={<TasksList />} />
				<Route path="/tasks/index/:fieldName/:fieldValue" element={<TasksList />} />
				<Route path="/tasks/view/:pageid" element={<TasksView />} />
				<Route path="/tasks/add" element={<TasksAdd />} />
				<Route path="/tasks/edit/:pageid" element={<TasksEdit />} />

				{/* taskstatuses pages routes */}
				<Route path="/taskstatuses" element={<TaskstatusesList />} />
				<Route path="/taskstatuses/:fieldName/:fieldValue" element={<TaskstatusesList />} />
				<Route path="/taskstatuses/index/:fieldName/:fieldValue" element={<TaskstatusesList />} />
				<Route path="/taskstatuses/view/:pageid" element={<TaskstatusesView />} />
				<Route path="/taskstatuses/add" element={<TaskstatusesAdd />} />
				<Route path="/taskstatuses/edit/:pageid" element={<TaskstatusesEdit />} />

				{/* users pages routes */}
				<Route path="/users" element={<UsersList />} />
				<Route path="/users/:fieldName/:fieldValue" element={<UsersList />} />
				<Route path="/users/index/:fieldName/:fieldValue" element={<UsersList />} />
				<Route path="/users/view/:pageid" element={<UsersView />} />
				<Route path="/users/add" element={<UsersAdd />} />
				<Route path="/users/edit/:pageid" element={<UsersEdit />} />
				<Route path="/account/*" element={<AccountPages />} />
			</Route>
			</Route>
			<Route exact element={<IndexLayout />}>
				<Route path="/" element={<DefaultPage />} />
				<Route path="/*" element={<IndexPages />} />
				<Route path="/error/*" element={<ErrorPages />} />
			</Route>
		</Routes>
	);
}
export default App;
