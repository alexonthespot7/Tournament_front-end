import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Main from '../Main';
import PublicRoute from './PublicRoute';
import Signup from '../PublicComponents/Signup';
import Login from '../PublicComponents/Login';
import AuthRoute from './AuthRoute';
import Bracket from '../UserComponents/Bracket';
import Competitors from '../UserComponents/Competitors';
import PersonalRoute from './PersonalRoute';
import PersonalPage from '../UserComponents/PersonalPage';
import RoundsUser from '../UserComponents/RoundsUser';
import AdminRoute from './AdminRoute';
import RoundsAdmin from '../AdminComponents/RoundsAdmin';
import Stages from '../AdminComponents/Stages';
import Users from '../AdminComponents/Users';

export default function AllRoutes() {
    const location = useLocation();
    const url = new URLSearchParams();
    url.set('redirect', location.pathname + location.search);

    return (
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Main />} />
            <Route
                path='/login'
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path='/signup'
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                }
            />
            <Route
                path='/bracket'
                element={
                    <AuthRoute>
                        <Bracket />
                    </AuthRoute>
                }
            />
            <Route
                path='/competitors'
                element={
                    <AuthRoute>
                        <Competitors />
                    </AuthRoute>
                }
            />
            <Route
                path='/competitors/:id'
                element={
                    <PersonalRoute>
                        <PersonalPage />
                    </PersonalRoute>
                }
            />
            <Route
                path='/rounds'
                element={
                    <AuthRoute>
                        <RoundsUser />
                    </AuthRoute>
                }
            />
            <Route
                path='/admin/rounds'
                element={
                    <AdminRoute>
                        <RoundsAdmin />
                    </AdminRoute>
                }
            />
            <Route
                path='/admin/stages'
                element={
                    <AdminRoute>
                        <Stages />
                    </AdminRoute>
                }
            />
            <Route
                path='/admin/users'
                element={
                    <AdminRoute>
                        <Users />
                    </AdminRoute>
                }
            />
            <Route
                path='*'
                element={
                    <Navigate to='/' />
                }
            />
        </Routes>
    );
}