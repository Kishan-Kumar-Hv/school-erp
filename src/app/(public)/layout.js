import { dbConnect } from '@/lib/db';
import { SchoolInfo, Notice } from '@/models/Schemas';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  await dbConnect();
  
  let school = await SchoolInfo.findOne();
  let notices = await Notice.find().sort({ date: -1 }).limit(5);

  // Serialize Mongoose docs to plain objects for client components
  school = school ? JSON.parse(JSON.stringify(school)) : null;
  notices = notices ? JSON.parse(JSON.stringify(notices)) : [];

  return (
    <div className="app-container min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header school={school} notices={notices} />
      <main className="main-content flex-1">
        {children}
      </main>
      <Footer school={school} />
    </div>
  );
}
