import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout, { useProgress } from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Curriculum from './pages/Curriculum';
import LessonReader from './pages/LessonReader';
import SlideRoom from './pages/SlideRoom';
import SoundLab from './pages/SoundLab';
import Glossary from './pages/Glossary';
import QuizHub from './pages/QuizHub';
import Condensed from './pages/Condensed';
import { Library, References } from './pages/Extra';

function Shell() {
  const { p, setP } = useProgress();
  return (
    <Layout p={p} setP={setP}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard p={p} setP={setP} />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/lesson/:id" element={<LessonReader p={p} setP={setP} />} />
        <Route path="/slides/:day" element={<SlideRoom p={p} />} />
        <Route path="/lab" element={<SoundLab />} />
        <Route path="/glossary" element={<Glossary p={p} setP={setP} />} />
        <Route path="/quiz" element={<QuizHub />} />
        <Route path="/condensed" element={<Condensed />} />
        <Route path="/library" element={<Library />} />
        <Route path="/references" element={<References />} />
        <Route path="*" element={<div className="card section"><h2>หาไม่เจอ (404)</h2><a href="#/">กลับหน้าแรก</a></div>} />
      </Routes>
    </Layout>
  );
}
export default function App() {
  return <HashRouter><Shell /></HashRouter>;
}
