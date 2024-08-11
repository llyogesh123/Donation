import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Donate.css'; // Import the CSS file

const stripePromise = loadStripe('pk_test_51PmbwKP0k30ENs6hNn2xE69FcvTXstfzIi8D12zSyFQRZjdxwEfRFUqmHdDDhcZ3HKJdT3QAAjR6t1DU6BADykdy0008sn4Adv');

const DonateForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: parseInt(amount) * 100 }),
      });

      const paymentIntentResponse = await response.json();

      if (paymentIntentResponse.error) {
        setError(paymentIntentResponse.error);
        setLoading(false);
        return;
      }

      const { client_secret } = paymentIntentResponse;

      const { error: confirmError } = await stripe.confirmCardPayment(client_secret);

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
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