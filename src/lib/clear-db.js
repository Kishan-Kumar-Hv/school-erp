const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../../.env.local');
let mongodbUri = 'mongodb://127.0.0.1:27017/school-cms';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/MONGODB_URI\s*=\s*(.+)/);
  if (match && match[1]) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

async function run() {
  try {
    console.log(`Connecting to database: ${mongodbUri.split('@')[1] || mongodbUri}...`);
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");

    const collections = [
      'school',
      'hero',
      'about',
      'principal',
      'facilities',
      'academics',
      'faculty',
      'gallery',
      'events',
      'notices',
      'contact',
      'settings'
    ];

    for (const colName of collections) {
      console.log(`Clearing collection: ${colName}...`);
      try {
        await mongoose.connection.db.collection(colName).deleteMany({});
      } catch (err) {
        console.log(`Collection ${colName} might not exist yet: ${err.message}`);
      }
    }

    console.log("All school mock data deleted successfully! User accounts preserved.");
    process.exit(0);
  } catch (err) {
    console.error("Error during database clearing:", err);
    process.exit(1);
  }
}

run();
