import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { db } from '@/config/firebase-admin';

// Helper function to upload image to imgbb
async function uploadImageToImgbb(imagePath: string): Promise<string> {
  const imageBuffer = await fs.readFile(imagePath);
  const form = new FormData();
  form.append('image', imageBuffer.toString('base64'));

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: 'POST',
    body: form,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error('Image upload failed');
  }

  return data.data.url;
}

// Helper to parse form data
async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  return new Promise((resolve, reject) => {
    // Convert NextRequest to Node.js IncomingMessage for formidable
    const buffer = Buffer.from(''); // This is simplified - you'd need to handle the stream properly
    
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const assignee = formData.get('assignee') as string;
    const tags = formData.get('tags') as string;
    const deadline = formData.get('deadline') as string;
    const description = formData.get('description') as string;
    const project = formData.get('project') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;
    const userId = formData.get('userId') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = '';

    // Handle image upload if present
    if (image) {
      // Convert File to buffer and save temporarily
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = `/tmp/${Date.now()}-${image.name}`;
      await fs.writeFile(tempPath, buffer);
      
      try {
        imageUrl = await uploadImageToImgbb(tempPath);
        // Clean up temp file
        await fs.unlink(tempPath);
      } catch (error) {
        // Clean up temp file even if upload fails
        await fs.unlink(tempPath).catch(() => {});
        throw error;
      }
    }

    // Prepare task data
    const taskData = {
      name,
      assignee,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      deadline,
      description,
      project,
      priority,
      status,
      userId,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const docRef = await db.collection('tasks').add(taskData);
    
    return NextResponse.json(
      { id: docRef.id, ...taskData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    let query = db.collection('tasks');
    
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const tasks = snapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
