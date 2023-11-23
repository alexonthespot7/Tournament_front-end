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
        <Stack sx={{ position: 'absolute', left: 10, top: 125 }} spacing={4}>
          <div className='thin-line left-top'></div>
          <div className='thin-line left-top second' style={{ marginLeft: 25, marginTop: 15 }}></div>
          <div className='thin-line left-top third' style={{ marginLeft: 50, marginTop: 15 }}></div>
        </Stack>
        <Stack sx={{ position: 'absolute', right: 10, top: 125 }} spacing={4}>
          <div className='thin-line right-top'></div>
          <div className='thin-line right-top second' style={{ marginLeft: -10, marginTop: 20 }}></div>
          <div className='thin-line right-top third' style={{ marginLeft: -20, marginTop: 20 }}></div>
        </Stack>
        <Stack sx={{ position: 'absolute', right: 10, bottom: 60 }} spacing={4}>
          <div className='thin-line left-top third'></div>
          <div className='thin-line left-top second' style={{ marginLeft: 10, marginTop: 20 }}></div>
          <div className='thin-line left-top' style={{ marginLeft: 20, marginTop: 20 }}></div>
        </Stack>
        <Stack sx={{ position: 'absolute', left: 60, bottom: 60 }} spacing={4}>
          <div className='thin-line right-top third'></div>
          <div className='thin-line right-top second' style={{ marginLeft: -25, marginTop: 20 }}></div>
          <div className='thin-line right-top' style={{ marginLeft: -50, marginTop: 20 }}></div>
        </Stack>
        <Bracket />
      </div>
    </div>
  );
}

export default App;
