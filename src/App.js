import './App.css';

import AllRoutes from './Components/Routes/AllRoutes';
import MyToolbar from './Components/Toolbar/MyToolbar';

function App() {
  return (
    <div className='App'>
      <MyToolbar />
      <div className='App-header'>
        <AllRoutes />
      </div>
    </div>
  );
}

export default App;
