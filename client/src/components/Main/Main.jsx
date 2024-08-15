import styles from "./styles.module.css";
import {Link} from "react-router-dom"
import  { useEffect, useState } from 'react';
import axios from 'axios';
import './Main.css';
import logo1 from '../img/fund_logo3.png';

const Main = () => {
	const [fundraisings, setFundraisings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  
	useEffect(() => {
	  const fetchFundraisings = async () => {
		try {
		  const response = await axios.get('https://donation-7.onrender.com/api/fundraising/fundraising');
		  setFundraisings(response.data);
		  setLoading(false);
		} catch (err) {
		  setError(err.message);
		  setLoading(false);
		}
	  };
  
	  fetchFundraisings();
	}, []);
  
	if (loading) {
	  return <div>Loading...</div>;
	}
  
	if (error) {
	  return <div>Error: {error}</div>;
	}
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className="background">
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
			<img src={logo1} alt="Logo1" className="logo1" />
				<h1><Link to="/history">History</Link></h1>
				<h1><Link to="/about" className="no-underline">About Us</Link></h1>
				<h1><Link to="/create">Create</Link></h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
			<div className="main-container">
      <h2>Donate Fund</h2>
      <div className="card-container">
        {fundraisings.map((fundraising) => (
          <div className="card" key={fundraising._id}>
            <h3>{fundraising.name}</h3>
            <img src={fundraising.image} alt={fundraising.name} />
            <p>Price: Rs {fundraising.price}</p>
			<p>Contact:{fundraising.contactNumber}</p>
            <p>{fundraising.description}</p>
			<button className="button"><Link to="/donate">Donate</Link></button>
          </div>
        ))}
      </div>
    </div>
		</div>
		</div>
	);
};

export default Main;
