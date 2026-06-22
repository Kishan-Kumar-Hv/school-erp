import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default async function ContactPage() {
  await dbConnect();

  const contact = await Models.Contact.findOne();
  const sContact = contact ? JSON.parse(JSON.stringify(contact)) : {};

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">CONTACT US</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Contact Us</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Coordinates Details Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-t-4 border-t-[#0B3C5D]">
              <h3 className="font-serif text-[#0B3C5D] text-xl font-bold mb-4">Get In Touch</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Have a question or want to visit our campus? Please reach out to our administration office via any of the coordinates below or submit an inquiry form.
              </p>

              <ul className="contact-info-list list-none flex flex-col gap-5 text-xs text-slate-600">
                <li className="flex gap-3.5 items-start">
                  <MapPin size={18} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Campus Address:</strong>
                    <p className="text-slate-500 mt-1 leading-relaxed">{sContact.address || "Hemavathi Nagar / Vidyuth Nagar, Salagame Road, Hassan, Karnataka - 573202"}</p>
                  </div>
                </li>
                
                <li className="flex gap-3.5 items-start">
                  <Phone size={18} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Phone Numbers:</strong>
                    <p className="text-slate-500 mt-1">{sContact.phone || "+91 81722 68512"}</p>
                  </div>
                </li>

                <li className="flex gap-3.5 items-start">
                  <Mail size={18} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Email Address:</strong>
                    <p className="text-slate-500 mt-1">{sContact.email || "admin@holycrosshassan.edu.in"}</p>
                  </div>
                </li>

                <li className="flex gap-3.5 items-start">
                  <Clock size={18} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Office Timings:</strong>
                    <p className="text-slate-500 mt-1">Monday - Friday: 9:00 AM to 4:00 PM<br />Saturday: 9:00 AM to 1:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map */}
            {sContact.mapLink && (
              <div className="w-full h-[320px] rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <iframe 
                  title="School GPS Map"
                  src={sContact.mapLink}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {/* Inquiry Form Column */}
          <div>
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
}
