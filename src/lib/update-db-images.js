/**
 * Database update script to set real image paths for the facilities/amenities.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read MONGODB_URI from .env.local
const envPath = path.join(__dirname, '..', '..', '.env.local');
let mongodbUri = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('MONGODB_URI=')) {
      mongodbUri = line.split('MONGODB_URI=')[1].trim();
      break;
    }
  }
} catch (error) {
  console.error('Error reading .env.local:', error);
}

if (!mongodbUri) {
  mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-cms';
}

console.log('Connecting to database...');

const FacilitySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  iconName: String
}, { collection: 'facilities' });

const Facility = mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);

const facilityImageMapping = {
  'Composite Science Lab': '/assets/facility_science_lab.png',
  'STEM Coding Studio': '/assets/facility_coding_studio.png',
  'Reference Library': '/assets/facility_library.png',
  'Smart Classrooms': '/assets/facility_smart_class.png',
  'Sports Turf Fields': '/assets/facility_sports_turf.png',
  'Arts & Pottery Lab': '/assets/facility_art_lab.png'
};

async function updateFacilities() {
  try {
    await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB!');

    // First list what facilities exist currently
    const facilities = await Facility.find({});
    console.log(`Found ${facilities.length} facilities in database.`);

    for (const facility of facilities) {
      const mappedImage = facilityImageMapping[facility.name];
      if (mappedImage) {
        console.log(`Updating "${facility.name}" -> image: "${mappedImage}"`);
        facility.image = mappedImage;
        await facility.save();
      } else {
        console.log(`No mapping found for facility: "${facility.name}"`);
      }
    }

    console.log('Database update completed successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

updateFacilities();
