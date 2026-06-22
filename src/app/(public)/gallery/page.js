import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import GalleryLightbox from '@/components/GalleryLightbox';

export default async function GalleryPage() {
  let gallery = [];

  try {
    await dbConnect();
    gallery = await Models.Gallery.find();
  } catch (err) {
    console.warn("Database offline. Running Gallery page in fallback mode.");
  }

  const sGallery = JSON.parse(JSON.stringify(gallery));

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-20 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2 tracking-wide">Campus Media Gallery</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Gallery</div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-16 px-[5%]">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-2">Moments & Highlights</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Take a look at glimpses of our campus life, classroom environments, laboratories, sporting events, and student celebrations.
          </p>
        </div>

        <GalleryLightbox images={sGallery} />
      </div>
    </div>
  );
}
