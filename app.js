const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});

const FormData = mongoose.model('datas', formSchema, 'datas');

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const formData = new FormData({ name, email, phone });

        await formData.save();
        console.log('Data saved to MongoDB:', formData);

        res.send('<h2>Form submitted successfully and saved to MongoDB!</h2>');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Error saving data');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
