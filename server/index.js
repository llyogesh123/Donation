require("dotenv").config();
const express = require("express");
const app = express();
const Stripe = require('stripe');
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const fundraisingRoutes = require("./routes/fundraising")
const Payment = require('./models/Payment');
const mongoose = require('mongoose');

// database connection
connection();

mongoose.set('strictQuery', true);

// middlewares
app.use(express.json());
app.use(cors());

const stripe = Stripe('sk_test_51PmbwKP0k30ENs6hPvtxFMMAyu5QfQdu0rzgo8n0xZFUDd4ScSuswN7y5piCf6VRbSnKJGNh4k5pEHx4yD4Io3qn0049yCLpPM');

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/fundraising",fundraisingRoutes);

app.post('/api/create-payment-intent', async (req, res) => {
  const { paymentMethodId, amount, name, email, toWhom } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    const payment = new Payment({
      name,
      amount,
      email,
      toWhom,
      clientSecret: paymentIntent.client_secret,
    });

    await payment.save();

    res.send({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
