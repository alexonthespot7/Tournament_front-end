import './App.css';
import { AppBar, Stack, Toolbar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import ContextWrapper from './context/ContextWrapper';
import Main from './Components/Main';
import Login from './Components/PublicComponents/Login';
import Signup from './Components/PublicComponents/Signup';
import Competitors from './Components/UserComponents/Competitors';
import PersonalPage from './Components/UserComponents/PersonalPage';
import RoundsUser from './Components/UserComponents/RoundsUser';
import Bracket from './Components/UserComponents/Bracket';
import RoundsAdmin from './Components/AdminComponents/RoundsAdmin';
import Stages from './Components/AdminComponents/Stages';
import Users from './Components/AdminComponents/Users';
import AllRoutes from './Components/Routes/AllRoutes';
import MyToolbar from './Components/Toolbar/MyToolbar';



function App() {
  return (
    <div className="App">
      <MyToolbar />
      <div className="App-header">
        <AllRoutes />
      </div>

    </div>
  );
}

export default App;
