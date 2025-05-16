const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/textlist')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const textItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Model
const TextItem = mongoose.model('TextItem', textItemSchema);

// Routes
// Hello World
app.get('/api/hello', async (req, res) => {
  res.status(200).send("Hello");
})

// Get all text items
app.get('/api/items', async (req, res) => {
  try {
    const items = await TextItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new text item
app.post('/api/items', async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Text is required' });
  }
  
  const newItem = new TextItem({ text });
  
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a text item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await TextItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
