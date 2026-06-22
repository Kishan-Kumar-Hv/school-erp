import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { uploadAsset } from '@/lib/upload';
import * as Models from '@/models/Schemas';

// Maps module parameter names to Mongoose models
function getModel(moduleName) {
  const map = {
    'school': Models.SchoolInfo,
    'hero': Models.Hero,
    'about': Models.About,
    'principal': Models.Principal,
    'facilities': Models.Facility,
    'academics': Models.Academics,
    'faculty': Models.Faculty,
    'gallery': Models.Gallery,
    'events': Models.Event,
    'notices': Models.Notice,
    'notice-board': Models.Notice, // handles notice-board as notices
    'contact': Models.Contact,
    'settings': Models.Settings
  };
  return map[moduleName];
}

// 1. GET - Retrieve module content
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { module } = await params;
    const Model = getModel(module);

    if (!Model) {
      return NextResponse.json({ error: `Module '${module}' not found` }, { status: 404 });
    }

    // Determine if it is a single object schema or multiple list items schema
    const singleDocModules = ['school', 'hero', 'about', 'principal', 'academics', 'contact', 'settings'];

    if (singleDocModules.includes(module)) {
      let doc = await Model.findOne();
      if (!doc) {
        // Create an empty default doc if it doesn't exist
        doc = await Model.create({});
      }
      return NextResponse.json(doc);
    } else {
      // List items modules (facilities, faculty, gallery, events, notices)
      let docs;
      if (module === 'faculty') {
        docs = await Model.find().sort({ order: 1 });
      } else if (module === 'events' || module === 'notices' || module === 'notice-board') {
        docs = await Model.find().sort({ date: -1 });
      } else {
        docs = await Model.find();
      }
      return NextResponse.json(docs);
    }
  } catch (error) {
    console.error('API GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST - Add new items (for lists like facilities, faculty, gallery, events, notices)
export async function POST(req, { params }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { module } = await params;
    const Model = getModel(module);

    if (!Model) {
      return NextResponse.json({ error: `Module '${module}' not found` }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let data = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const payload = {};
      
      // Parse texts and upload any files
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.size > 0) {
            const url = await uploadAsset(value, value.name, module);
            payload[key] = url;
          }
        } else {
          payload[key] = value;
        }
      }
      data = payload;
    } else {
      data = await req.json();
    }

    const doc = await Model.create(data);
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error('API POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT - Update existing document or list item
export async function PUT(req, { params }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { module } = await params;
    const Model = getModel(module);

    if (!Model) {
      return NextResponse.json({ error: `Module '${module}' not found` }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let data = {};
    let id = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const payload = {};
      
      // Extract optional item ID for lists
      id = formData.get('id') || formData.get('_id');

      for (const [key, value] of formData.entries()) {
        if (key === 'id' || key === '_id') continue;
        if (value instanceof File) {
          if (value.size > 0) {
            const url = await uploadAsset(value, value.name, module);
            payload[key] = url;
          }
        } else {
          payload[key] = value;
        }
      }
      data = payload;
    } else {
      const body = await req.json();
      id = body.id || body._id;
      data = { ...body };
      delete data.id;
      delete data._id;
    }

    const singleDocModules = ['school', 'hero', 'about', 'principal', 'academics', 'contact', 'settings'];

    if (singleDocModules.includes(module) && !id) {
      // Update global single document
      let doc = await Model.findOne();
      if (!doc) {
        doc = await Model.create(data);
      } else {
        doc = await Model.findByIdAndUpdate(doc._id, data, { new: true });
      }
      return NextResponse.json({ success: true, data: doc });
    } else {
      // Update specific item in list
      if (!id) {
        return NextResponse.json({ error: 'Missing item ID for update operation' }, { status: 400 });
      }
      const doc = await Model.findByIdAndUpdate(id, data, { new: true });
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: doc });
    }
  } catch (error) {
    console.error('API PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. DELETE - Delete list items (facilities, faculty, gallery, events, notices)
export async function DELETE(req, { params }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { module } = await params;
    const Model = getModel(module);

    if (!Model) {
      return NextResponse.json({ error: `Module '${module}' not found` }, { status: 404 });
    }

    // Get ID from query parameters e.g. /api/cms/events?id=123
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID for delete operation' }, { status: 400 });
    }

    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('API DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
