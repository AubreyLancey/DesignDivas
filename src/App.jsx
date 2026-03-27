import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Home'
import Feedback from './Feedback';

import MenuBar from './components/MenuBar'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Feedback" element={<Feedback />} />
      </Routes>

      <MenuBar />
      
    </div>
  );
}

export default App;