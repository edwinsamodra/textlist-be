require('dotenv').config()
const mongoose = require('mongoose')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODBURI)
    console.log('Connected')

    const textItemSchema = new mongoose.Schema({
      text: String,
      createdAt: { type: Date, default: Date.now }
    })
    const TextItem = mongoose.model('TextItem', textItemSchema)

    const sample = [
      { text: "First text item" },
      { text: "Second text item" },
      { text: "Third text item" }
    ]

    await TextItem.deleteMany({})
    console.log('Cleared existing data')

    const inserted = await TextItem.insertMany(sample)
    console.log(`Inserted ${inserted.length} items`)

    await mongoose.disconnect()
    console.log('Done')
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
