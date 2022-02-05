import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Character } from './pages/Character';
import { Home } from './pages/Home';
import { Kill } from './pages/Kill';
import { Search } from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kill/:id" element={<Kill />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/search/:query" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
