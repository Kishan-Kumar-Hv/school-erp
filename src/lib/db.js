import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-cms';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    // Check if database needs seeding
    await seedDatabase();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Seeding function to populate initial CMS content so the site is never empty
async function seedDatabase() {
  const conn = mongoose.connection;
  
  // 1. User collection seeding
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  }));

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Seeded default admin user: admin / admin123');
  }

  // 2. School Info
  const SchoolInfo = mongoose.models.SchoolInfo || mongoose.model('SchoolInfo', new mongoose.Schema({
    name: String,
    logo: String,
    address: String,
    phone: String,
    email: String,
    mapLink: String
  }, { collection: 'school' }));

  if (await SchoolInfo.countDocuments() === 0) {
    await SchoolInfo.create({
      name: 'Holy Cross Sisters School, Hassan',
      logo: '/assets/logo.png',
      address: 'Hemavathi Nagar / Vidyuth Nagar, Salagame Road, Hassan, Karnataka - 573202',
      phone: '+91 81722 68512',
      email: 'admin@holycrosshassan.edu.in',
      mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.1643444458315!2d76.10899217592476!3d13.025219913702585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba55146c2459bb5%3A0xe67c9c0f64c67675!2sHoly%20Cross%20Sisters%20School%2C%20Hassan!5e0!3m2!1sen!2sin!4v1718985100000!5m2!1sen!2sin'
    });
    console.log('Seeded school info');
  }

  // 3. Hero
  const Hero = mongoose.models.Hero || mongoose.model('Hero', new mongoose.Schema({
    title: String,
    subtitle: String,
    admissionText: String,
    image: String
  }, { collection: 'hero' }));

  if (await Hero.countDocuments() === 0) {
    await Hero.create({
      title: 'Holy Cross Sisters School',
      subtitle: 'Building Future Leaders through Value-Based Academic Excellence',
      admissionText: 'Admissions Open for Academic Year 2027-28',
      image: '/assets/holy_cross_hero.png'
    });
    console.log('Seeded hero section');
  }

  // 4. About
  const About = mongoose.models.About || mongoose.model('About', new mongoose.Schema({
    aboutText: String,
    vision: String,
    mission: String
  }, { collection: 'about' }));

  if (await About.countDocuments() === 0) {
    await About.create({
      aboutText: 'Holy Cross Sisters School, Hassan, founded in 1978 and managed by the Sisters of Mercy, is dedicated to providing high-quality, value-based education. Located in Hemavathi Nagar, Hassan, our school caters to pupils from Preschool through High School. Our school promotes academic excellence, creative arts, physical strength, and technological awareness. We offer students a safe environment where they can discover their unique abilities and acquire the skills needed for tomorrow.',
      vision: 'To establish a value-driven center of educational excellence that empowers students with modern skills while keeping them rooted in ethics, service, and love.',
      mission: 'To provide accessible, top-quality teaching modules; encourage technological literacy; develop sporting spirit; and guide students to become compassionate citizens of our nation.'
    });
    console.log('Seeded about section');
  }

  // 5. Principal
  const Principal = mongoose.models.Principal || mongoose.model('Principal', new mongoose.Schema({
    name: String,
    photo: String,
    message: String
  }, { collection: 'principal' }));

  if (await Principal.countDocuments() === 0) {
    await Principal.create({
      name: 'Sr. Maria Philomina',
      photo: '/assets/principal.png',
      message: 'Welcome to Holy Cross Sisters School. We are dedicated to nurturing each child\'s intellectual, emotional, and social development. By integrating core human values with modern curriculum standards, we ensure our graduates are thoroughly equipped to take on future global challenges.'
    });
    console.log('Seeded principal info');
  }

  // 6. Facilities
  const Facility = mongoose.models.Facility || mongoose.model('Facility', new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    iconName: String
  }, { collection: 'facilities' }));

  if (await Facility.countDocuments() === 0) {
    await Facility.create([
      { name: 'Composite Science Lab', description: 'Equipped with Physics, Chemistry, and Biology apparatus for practical inquiry.', image: '', iconName: 'Award' },
      { name: 'STEM Coding Studio', description: 'Modern desktops, programming packages, and physical computing kits.', image: '', iconName: 'Cpu' },
      { name: 'Reference Library', description: 'Over 5,000 reference educational volumes, novels, and national journals.', image: '', iconName: 'BookOpen' },
      { name: 'Smart Classrooms', description: 'High-definition projector layouts and integrated visual media boards.', image: '', iconName: 'Tv' },
      { name: 'Sports Turf Fields', description: 'Dedicated football field turf, volleyball courts, and running athletic tracks.', image: '', iconName: 'Trophy' },
      { name: 'Arts & Pottery Lab', description: 'Professional pottery wheels, watercolor sketchboards, and handicraft desks.', image: '', iconName: 'Palette' }
    ]);
    console.log('Seeded facilities');
  }

  // 7. Academics
  const Academics = mongoose.models.Academics || mongoose.model('Academics', new mongoose.Schema({
    prePrimaryContent: String,
    primaryContent: String,
    highSchoolContent: String,
    puCollegeContent: String
  }, { collection: 'academics' }));

  if (await Academics.countDocuments() === 0) {
    await Academics.create({
      prePrimaryContent: 'Learning through play, sensory exploration, and motor skills refinement for LKG & UKG children.',
      primaryContent: 'Building strong reading habits, basic arithmetic math skills, and social etiquette guidelines.',
      highSchoolContent: 'Rigorous preparations for Board Examinations, technical computer codes, and SSLC preparations.',
      puCollegeContent: 'Comprehensive preparation for Pre-University board exams and competitive entrance examinations (CET/NEET).'
    });
    console.log('Seeded academics content');
  }

  // 8. Faculty
  const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', new mongoose.Schema({
    name: String,
    designation: String,
    photo: String,
    order: Number
  }, { collection: 'faculty' }));

  if (await Faculty.countDocuments() === 0) {
    await Faculty.create([
      { name: 'Sr. Maria Philomina', designation: 'Principal', photo: '', order: 1 },
      { name: 'Mrs. Shwetha R.', designation: 'Vice Principal & Social Science Lead', photo: '', order: 2 },
      { name: 'Mr. Dinesh Kumar', designation: 'Senior Mathematics & Physics Teacher', photo: '', order: 3 },
      { name: 'Mrs. Asha Jyothi', designation: 'English & Literature Coordinator', photo: '', order: 4 }
    ]);
    console.log('Seeded faculty roster');
  }

  // 9. Events
  const Event = mongoose.models.Event || mongoose.model('Event', new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    image: String
  }, { collection: 'events' }));

  if (await Event.countDocuments() === 0) {
    await Event.create([
      { title: 'Annual Science & Art Exhibition 2026', description: 'Students presenting scientific working models, clay art displays, and tech prototypes.', date: '2026-07-10', image: '' },
      { title: 'School Sports Meet 2026', description: 'Annual athletic events, inter-house football matches, and track and field competitions.', date: '2026-11-18', image: '' },
      { title: 'Cultural Day Celebrations', description: 'Traditional dances, plays, musical ensembles, and poetry recitations.', date: '2026-12-05', image: '' }
    ]);
    console.log('Seeded events');
  }

  // 10. Notices
  const Notice = mongoose.models.Notice || mongoose.model('Notice', new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String,
    date: String
  }, { collection: 'notices' }));

  if (await Notice.countDocuments() === 0) {
    await Notice.create([
      { title: 'Annual Science & Art Exhibition Notice', description: 'The school will host its annual Science & Art Exhibition on July 10th. Parents and guardians are cordially invited.', fileUrl: '', date: '2026-06-15' },
      { title: 'Admissions Open for Academic Year 2027-28', description: 'Enrollment for classes Nursery to Grade IX is now open. Apply online or download the admissions brochure.', fileUrl: '', date: '2026-06-18' }
    ]);
    console.log('Seeded notices');
  }

  // 11. Contact
  const Contact = mongoose.models.Contact || mongoose.model('Contact', new mongoose.Schema({
    address: String,
    phone: String,
    email: String,
    mapLink: String
  }, { collection: 'contact' }));

  if (await Contact.countDocuments() === 0) {
    await Contact.create({
      address: 'Hemavathi Nagar / Vidyuth Nagar, Salagame Road, Hassan, Karnataka - 573202',
      phone: '+91 81722 68512',
      email: 'admin@holycrosshassan.edu.in',
      mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.1643444458315!2d76.10899217592476!3d13.025219913702585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba55146c2459bb5%3A0xe67c9c0f64c67675!2sHoly%20Cross%20Sisters%20School%2C%20Hassan!5e0!3m2!1sen!2sin!4v1718985100000!5m2!1sen!2sin'
    });
    console.log('Seeded contact');
  }
}
