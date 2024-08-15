import { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css'; // Import the CSS file

const History = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('https://donation-7.onrender.com/payments');
        setPayments(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="history-container">
      <h1>Payment History</h1>
      <ul className="payment-list">
        {currentItems.map((payment) => (
          <li key={payment._id} className="payment-item">
            <div className="payment-box">
              <p><strong>Name:</strong> {payment.name}</p>
              <p><strong>Email:</strong> {payment.email}</p>
              <p><strong>Amount:</strong> {payment.amount}</p>
              <p><strong>To Whom:</strong> {payment.toWhom}</p>
              <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: Math.ceil(payments.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;