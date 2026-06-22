import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import * as Icons from 'lucide-react';

function FacilityIcon({ name, size = 24 }) {
  const IconComponent = Icons[name] || Icons.Award;
  return <IconComponent size={size} />;
}

export default async function FacilitiesPage() {
  await dbConnect();

  const facilities = await Models.Facility.find();
  const sFacilities = JSON.parse(JSON.stringify(facilities));

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">CAMPUS FACILITIES & INFRASTRUCTURE</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Facilities</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%]">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-2">Modern Academic Amenities</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our campus is equipped with standard educational amenities designed to facilitate active learning, scientific inquiry, and creative development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sFacilities.map((fac, idx) => (
            <div key={fac._id || idx} className="bg-white border border-slate-200 border-l-[5px] border-l-[#0B3C5D] rounded-lg p-6 shadow-sm hover:shadow-md hover:border-l-[#D9B310] transition-all flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-3 rounded-full flex-shrink-0">
                  <FacilityIcon name={fac.iconName} />
                </div>
                <h4 className="font-serif font-bold text-base text-[#0B3C5D]">{fac.name}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {fac.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
