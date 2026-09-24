
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useLocalStore from 'hooks/useLocalStore';
import useApi from 'hooks/useApi';
import useUtils from 'hooks/useUtils';

const publicPages = ['/', 'index', 'error', ]; //public pages which do not need authentation
const AuthContext = createContext();
export function AuthProvider({ children }) {
	const api = useApi();
	const utils = useUtils();
	const localStore = useLocalStore();
	const navigate = useNavigate();

	const accessToken = localStore.getToken();
	let loggedIn = false;
	if(accessToken){
		loggedIn = true;
	}
	const [user, setUser] = useState(null);
	const [userName, setUserName] = useState('');
	const [userId, setUserId] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [userPhone, setUserPhone] = useState('');
	const [userPhoto, setUserPhoto] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getUserData();
	}, [accessToken]);

	async function getUserData() {
		try {
			if (accessToken) {
				setIsLoggedIn(true);
				setLoading(true);
				const response = await api.get('account/currentuserdata');
				const userData = response.data;
				if(userData){
					setUser(userData);
					setUserName(userData.username);
					setUserId(userData.user_id);
					setUserEmail(userData.email);
					setUserPhoto(null);
					setUserPhone(userData.phone);
				}
			}
			else {
				setIsLoggedIn(false);
			}
		}
		catch (e) {
			setError("Unable to get user data");
			logout();
		}
		finally {
			setLoading(false);
		}
	}

	async function login(token) {
		localStore.saveLoginData({ token });
		setIsLoggedIn(true);
	}

	function logout(returnUrl=null) {
		localStore.removeLoginData();
		setUser(null);
		setIsLoggedIn(false);
		setLoading(true);
		if(returnUrl){
			navigate(`/?redirect=${returnUrl}` );
		}
		else{
			navigate('/');
		}
	}

	function pageRequiredAuth(path){
		const { pageName, routePath } = utils.parseRoutePath(path);
		return !publicPages.includes(pageName) && !publicPages.includes(routePath);
	}

	function isOwner(userRecId) {
		if(user){
			return userRecId === userId;
		}
		return false;
	}

	const providerValue = {
		user,
		userName,
		userId,
		userEmail,
		userPhone,
		userPhoto,
		loading,
		isLoggedIn,
		accessToken,
		error,
		isOwner,
		getUserData,
		pageRequiredAuth,
		login,
		logout,
	}

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	);
}

export {AuthContext}
