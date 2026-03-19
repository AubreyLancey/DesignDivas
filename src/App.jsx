import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Home'
import Feedback from './Feedback';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Feedback" element={<Feedback />} />
    </Routes>
  );
}

export default App;