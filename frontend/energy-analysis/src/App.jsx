import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateDesign from './pages/CreateDesign';
import CompareDesign from './pages/CompareDesign';
import CityRanking from './pages/CityRanking';
import AllDesigns from './pages/designs';
import {Toaster} from "react-hot-toast"
import EditDesign from './pages/editDesign';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateDesign />} />
        <Route path="/compare" element={<CompareDesign />} />
        <Route path="/ranking" element={<CityRanking />} />
        <Route path="/designs" element={<AllDesigns />} />
        <Route path="/edit-design/:id" element={<EditDesign />} />
      </Routes>
      <Toaster/>
    </Router>
  );
};

export default App;
