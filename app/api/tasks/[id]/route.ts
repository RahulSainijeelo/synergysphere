import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { db } from '@/config/firebase-admin';

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = db.collection('tasks').doc(params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data()
    });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Failed to get task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const currentImageUrl = formData.get('currentImageUrl') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = currentImageUrl || '';

    // Handle new image upload if present
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = `/tmp/${Date.now()}-${image.name}`;
      await fs.writeFile(tempPath, buffer);
      
      try {
        imageUrl = await uploadImageToImgbb(tempPath);
        await fs.unlink(tempPath);
      } catch (error) {
        await fs.unlink(tempPath).catch(() => {});
        throw error;
      }
    }

    const updateData = {
      name,
      assignee,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      deadline,
      description,
      project,
      priority,
      status,
      imageUrl,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('tasks').doc(params.id).update(updateData);
    
    return NextResponse.json({ 
      id: params.id, 
      ...updateData 
    });

  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.collection('tasks').doc(params.id).delete();
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
