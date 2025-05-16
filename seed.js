const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/textlist')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define the schema
const textItemSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// Create the model
const TextItem = mongoose.model('TextItem', textItemSchema);

// Sample data
const sampleData = [
  { text: "First text item" },
  { text: "Second text item" },
  { text: "Third text item" }
];

// Function to insert data
async function seedDatabase() {
  try {
    // Clear existing data
    await TextItem.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    const result = await TextItem.insertMany(sampleData);
    console.log('Successfully inserted', result.length, 'documents');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
