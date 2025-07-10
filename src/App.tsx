import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GeneralLayout from './layouts/GeneralLayout';
import Home from './pages/Home/Home';
import MapPage from './pages/MapPage/MapPage';
import EventsPage from './pages/EventsPage/EventsPage';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import EventDetail from './pages/EventDetail/EventDetail';

function App() {
  return (
    <Router>
      <GeneralLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/receta/:id" element={<RecipeDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </GeneralLayout>
    </Router>
  );
}

export default App;