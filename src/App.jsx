import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './Welcome';
function App() {
  return (
    <Router>
      <div className="App bg-black">
        <Routes>
          <Route path="/" element={<Welcome />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App
