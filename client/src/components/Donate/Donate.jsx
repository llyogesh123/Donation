import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Donate.css'; // Import the CSS file
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51PmbwKP0k30ENs6hNn2xE69FcvTXstfzIi8D12zSyFQRZjdxwEfRFUqmHdDDhcZ3HKJdT3QAAjR6t1DU6BADykdy0008sn4Adv');

const DonateForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [toWhom, setToWhom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    try {
      const response = await axios.post('https://donation-7.onrender.com/api/create-payment-intent', {
        paymentMethodId: cardElement.id,
        amount,
        name,
        email,
        toWhom,
      });
  
      const { client_secret } = response.data;
  
      const paymentResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });
  
      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donate-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="donate-input"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="donate-input"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="donate-input"
      />
       <input
        type="text"
        placeholder="To Whom"
        value={toWhom}
        onChange={(e) => setToWhom(e.target.value)}
        className="donate-input"
      />
      <CardElement className="donate-card-element" />
      <button type="submit" disabled={!stripe || loading} className="donate-button">
        {loading ? 'Processing...' : 'Donate'}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Payment successful!</div>}
    </form>
  );
};

const Donate = () => (
  <Elements stripe={stripePromise}>
    <DonateForm />
  </Elements>
);

export default Donate;