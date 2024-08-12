import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main/Main';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import About from './components/About/About';
import Create from './components/Create/Create';
import Donate from './components/Donate/Donate';
import History from './components/History/History';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
    const user = localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {user && <Route path="/" exact element={<Main />} />}
                <Route path="/signup" exact element={<Signup />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/main" element={<ProtectedRoute component={Main} />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/about" exact element={<About />} />
                <Route path="/create" exact element={<Create />} />
                <Route path="/donate" exact element={<Donate />} />
                <Route path="/history" exact element={<History />} />
            </Routes>
        </Router>
    );
}

export default App;