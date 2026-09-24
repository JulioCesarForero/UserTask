
import { Routes, Route } from 'react-router';


import IndexLayout from 'layouts/IndexLayout';
import MainLayout from 'layouts/MainLayout';
import NotesList from 'src/pages/notes/List';
import NotesView from 'src/pages/notes/View';
import NotesAdd from 'src/pages/notes/Add';
import NotesEdit from 'src/pages/notes/Edit';
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

import HomePage from 'pages/home/HomePage';
import IndexPages from 'pages/index';
import ErrorPages from 'pages/errors';

import 'primereact/resources/themes/arya-blue/theme.css';
import 'assets/styles/layout.scss';
import 'src/index.scss';

const App = () => {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/home" element={<HomePage />} />
				

				{/* notes pages routes */}
				<Route path="/notes" element={<NotesList />} />
				<Route path="/notes/:fieldName/:fieldValue" element={<NotesList />} />
				<Route path="/notes/index/:fieldName/:fieldValue" element={<NotesList />} />
				<Route path="/notes/view/:pageid" element={<NotesView />} />
				<Route path="/notes/add" element={<NotesAdd />} />
				<Route path="/notes/edit/:pageid" element={<NotesEdit />} />

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
			</Route>
			<Route exact element={<IndexLayout />}>
				<Route path="/*" element={<IndexPages />} />
				<Route path="/error/*" element={<ErrorPages />} />
			</Route>
		</Routes>
	);
}
export default App;
