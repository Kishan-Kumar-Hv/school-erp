import mongoose from 'mongoose';

// User Schema (Auth)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// School Info Schema
const SchoolInfoSchema = new mongoose.Schema({
  name: String,
  logo: String,
  address: String,
  phone: String,
  email: String,
  mapLink: String
}, { collection: 'school' });

// Hero Schema
const HeroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  admissionText: String,
  image: String
}, { collection: 'hero' });

// About Schema
const AboutSchema = new mongoose.Schema({
  aboutText: String,
  vision: String,
  mission: String
}, { collection: 'about' });

// Principal Schema
const PrincipalSchema = new mongoose.Schema({
  name: String,
  photo: String,
  message: String
}, { collection: 'principal' });

// Facility Schema
const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  iconName: String
}, { collection: 'facilities' });

// Academics Schema
const AcademicsSchema = new mongoose.Schema({
  prePrimaryContent: String,
  primaryContent: String,
  highSchoolContent: String,
  puCollegeContent: String
}, { collection: 'academics' });

// Faculty Schema
const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  photo: String,
  order: { type: Number, default: 0 }
}, { collection: 'faculty' });

// Gallery Schema
const GallerySchema = new mongoose.Schema({
  image: { type: String, required: true }
}, { collection: 'gallery' });

// Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  image: String
}, { collection: 'events' });

// Notice Schema
const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: String,
  date: String
}, { collection: 'notices' });

// Contact Schema
const ContactSchema = new mongoose.Schema({
  address: String,
  phone: String,
  email: String,
  mapLink: String
}, { collection: 'contact' });

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  themeColor: { type: String, default: '#0B3C5D' },
  accentColor: { type: String, default: '#D9B310' }
}, { collection: 'settings' });

// Prevent model recompilation during HMR
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const SchoolInfo = mongoose.models.SchoolInfo || mongoose.model('SchoolInfo', SchoolInfoSchema);
export const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
export const About = mongoose.models.About || mongoose.model('About', AboutSchema);
export const Principal = mongoose.models.Principal || mongoose.model('Principal', PrincipalSchema);
export const Facility = mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);
export const Academics = mongoose.models.Academics || mongoose.model('Academics', AcademicsSchema);
export const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
