import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QrCodeScanner from './QrCodeScanner';
import AdminPage from './AdminPage';
import Welcome from './Welcome';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/scanner" element={<QrCodeScanner />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
