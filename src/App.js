import './App.css';
import { AppBar, Stack, Toolbar } from '@mui/material';
import logo_transparent from './assets/logo_transparent.png';
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



function App() {
  const { windowSize } = useContext(ContextWrapper);

  return (
    <div className="App">
      <AppBar position='fixed' sx={{ backgroundColor: '#E2E2E2', boxShadow: 7 }}>
        <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <img src={logo_transparent} width={165 + windowSize.width / 28} height='auto' alt='Logo' />
        </Toolbar>
      </AppBar>
      <div className="App-header">
        <Competitors />
      </div>

    </div>
  );
}

export default App;
