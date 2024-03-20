import { HashRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
