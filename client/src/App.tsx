import { HashRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Home from './components/Home';

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
