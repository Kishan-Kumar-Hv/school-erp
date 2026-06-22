import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import * as Icons from 'lucide-react';

function FacilityIcon({ name, size = 20 }) {
  const IconComponent = Icons[name] || Icons.Award;
  return <IconComponent size={size} />;
}

export default async function FacilitiesPage() {
  let facilities = [];

  try {
    await dbConnect();
    facilities = await Models.Facility.find();
  } catch (err) {
    console.warn("Database offline. Running Facilities page in fallback mode.");
  }

  const sFacilities = JSON.parse(JSON.stringify(facilities));

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Premium Hero Banner */}
      <div className="page-banner relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white py-24 px-[5%] text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="page-title font-serif text-3xl md:text-5xl font-bold mb-4 tracking-wide relative z-10">
          Campus Facilities & Infrastructure
        </h1>
        <div className="page-breadcrumbs text-sm text-slate-300 font-medium relative z-10">
          <span>Home</span>
          <span className="mx-2.5 text-[#D9B310]">&gt;</span>
          <span className="text-white">Facilities</span>
        </div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-20 px-[5%]">
        <div className="text-center mb-16 max-w-[700px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-3xl font-bold mb-4 tracking-tight">
            Modern Academic Amenities
          </h2>
          <div className="w-16 h-1 bg-[#D9B310] mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our campus is equipped with state-of-the-art educational amenities designed to facilitate active learning, scientific inquiry, and creative development. We believe in providing an environment that inspires excellence.
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sFacilities.map((fac, idx) => (
            <div 
              key={fac._id || idx} 
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-slate-100 flex flex-col h-full"
            >
              {/* Photo Area */}
              <div className="relative h-64 overflow-hidden bg-slate-100 flex-shrink-0">
                {fac.image ? (
                  <img 
                    src={fac.image} 
                    alt={fac.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#0B3C5D]/10 to-[#D9B310]/10 text-[#0B3C5D]">
                    <Icons.School size={48} className="opacity-40" />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                
                {/* Floating Icon Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0B3C5D] p-3.5 rounded-2xl shadow-md border border-white/20 transform group-hover:rotate-6 transition-transform duration-300">
                  <FacilityIcon name={fac.iconName} />
                </div>
              </div>

              {/* Text / Details Area */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xl text-[#0B3C5D] mb-4 group-hover:text-[#D9B310] transition-colors duration-200">
                    {fac.name}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
                
                {/* Interactive link/indicator */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0B3C5D] group-hover:text-[#D9B310] transition-colors duration-200">
                  <span>Explore Amenity</span>
                  <Icons.ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

