import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main/Main';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import About from './components/About/About';
import Create from './components/Create/Create';
import Donate from './components/Donate/Donate';
import History from './components/History/History';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
             <ToastContainer />
            <Routes>
                {token && <Route path="/" exact element={<Main />} />}
                <Route path="/signup" exact element={<Signup />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/main" element={<ProtectedRoute component={Main} />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/about" exact element={token ?<About /> : <Navigate to="/login"/>} />
                <Route path="/create" exact element={token ?<Create /> : <Navigate to="/login"/>} />
                <Route path="/donate" exact element={token ? <Donate /> : <Navigate to="/login" /> } />
                <Route path="/history" exact element={token ? <History /> : <Navigate to="/login" /> } />
            </Routes>
        </Router>
    );
}

export default App;