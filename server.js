// const express = require('express');
// // const mongoose = require('mongoose');
// // const fileRoutes = require('./routes/fileRoutes');
// const cors=require("cors")
// const app = express();
// const bodyParser=require('body-parser')
// const port = 5000;


// // Connect to MongoDB
// // mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch(err => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(express.json());
// app.use(cors())


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))
// // Routes
// const payuRoutes=require('./routes/payuRoutes')
// app.use('/api/payu', payuRoutes);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });




// const express = require('express');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/api/payu/hash", (req, res) => {
//     const { name, email, number, amount, transactionId } = req.body;
//     const data = {
//         key: "SnJ6HfYJ",
//         salt: "xcnaAlHCxA",
//         txnid: transactionId,
//         amount: amount,
//         productinfo: "Test Product",
//         name: name,
//         email: email,
//         number: number,
//         udf1: "details1",
//         udf2: "details2",
//         udf3: "details3",
//         udf4: "details4",
//         udf5: "details5",
//     };

//     // Create the string in the exact order required
//     const string = [
//         data.key,
//         data.txnid,
//         data.amount,
//         data.productinfo,
//         data.name,
//         data.email,
//         data.number,
//         data.udf1,
//         data.udf2,
//         data.udf3,
//         data.udf4,
//         data.udf5,
//         data.salt
//     ].join('|');

//     // Log the string to debug the hash generation
//     console.log("String for hash:", string);

//     const hash = crypto.createHash('sha512').update(string).digest('hex');

//     console.log("Generated hash:", hash);

//     return res.status(200).send({
//         hash: hash,
//         transactionId: transactionId,
//     });
// });

// app.post('/api/payu/success', (req, res) => {
//     console.log('Payment Success:', req.body);
//     res.redirect('http://localhost:3000');
// });

// app.post('/api/payu/failure', (req, res) => {
//     console.log('Payment Failure:', req.body);
//     res.redirect('http://localhost:3000');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const merchantKey = 'SnJ6HfYJ';
const salt = 'xcnaAlHCxA';

// Route to create a payment
// app.post('/api/payment', (req, res) => {
//     const { amount, email, phone, productinfo, firstname } = req.body;

//     // Generate a random transaction ID
//     const txnid = crypto.randomBytes(10).toString('hex');

//     const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex');

//     res.json({
//         txnid,
//         hash,
//         merchantKey,
//     });
// });




app.post('/api/payment', (req, res) => {
  console.log("Received request body:", req.body);
  const { amount, email, phone, productinfo, firstname, cartProductsData, city, state, address1, productname, productqty, udf1, udf2 } = req.body;

  // Generate a random transaction ID
  const txnid = crypto.randomBytes(10).toString('hex');

  // Log txnid and other values for debugging
  console.log("Transaction ID:", txnid);
  console.log("Formatted Amount:", parseFloat(amount).toFixed(2));
  console.log("Product Info:", productinfo);
  console.log("First Name:", firstname);
  console.log("Email:", email);
  console.log("City:", city);
  console.log("State:", state);
  console.log("Address:", address1);
  console.log("ProductName:", productname);
  console.log("Qty:", udf1);
  // console.log("cartProductsData:", cartProductsData);

  // Generate hash string (make sure to include new fields if necessary)
  const hashString = `${merchantKey}|${txnid}|${parseFloat(amount).toFixed(2)}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  console.log("Hash String:", hashString); // Log the hash string for debugging

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.json({
    txnid,
    hash,
    merchantKey,
  });
});



app.post('/success', async (req, res) => {
  try {
    console.log("Success Request Body:", req.body);
    console.log("Success Request Query:", req.query);
    console.log("Success Request Params:", req.params);
    const queryParams = new URLSearchParams(req.body).toString();

    // Redirect to the failure page with the query parameters
    return res.redirect(`http://localhost:3000/order-response?${queryParams}`);
  } catch (error) {
    console.log("Error in failure handler:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/failure', async (req, res) => {
  try {
    console.log("Failure Request Body:", req.body);
    console.log("Failure Request Query:", req.query);
    console.log("Failure Request Params:", req.params);

    // Convert req.body to query parameters
    const queryParams = new URLSearchParams(req.body).toString();

    // Redirect to the failure page with the query parameters
    return res.redirect(`https://parijathandicraft.com/order-response?${queryParams}`);

  } catch (error) {
    console.log("Error in failure handler:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
