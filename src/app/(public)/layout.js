import { dbConnect } from '@/lib/db';
import { SchoolInfo, Notice } from '@/models/Schemas';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  let school = null;
  let notices = [];
  let dbOffline = false;

  try {
    await dbConnect();
    school = await SchoolInfo.findOne();
    notices = await Notice.find().sort({ date: -1 }).limit(5);
  } catch (err) {
    console.warn("Database offline. Running layout in fallback mode.");
    dbOffline = true;
  }
  
  // Serialize Mongoose docs to plain objects for client components
  school = school ? JSON.parse(JSON.stringify(school)) : null;
  notices = notices ? JSON.parse(JSON.stringify(notices)) : [];

  return (
    <div className="app-container min-h-screen flex flex-col bg-[#F5F7FA]">
      {dbOffline && (
        <div className="bg-amber-500 text-white text-[11px] text-center py-1.5 font-semibold tracking-wide print:hidden">
          ⚠️ CMS database is currently offline. Website is running in demo mode. Add your MONGODB_URI in `.env.local` to publish changes.
        </div>
      )}
      <Header school={school} notices={notices} />
      <main className="main-content flex-1">
        {children}
      </main>
      <Footer school={school} />
      <FloatingWidgets school={school} />
    </div>
  );
}
