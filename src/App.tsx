import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/config';
import { Character } from './pages/Character';
import { Home } from './pages/Home';
import { Kill } from './pages/Kill';
import { Guild } from './pages/Guild';
import { Search } from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kill/:id" element={<Kill />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/guild/:id" element={<Guild />} />
        <Route path="/search/:query" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
