import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DocumentModel from '@/models/Document';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fix Next.js 15 params type change
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const body = await request.json();
    const { title, content } = body;

    const document = await DocumentModel.findOneAndUpdate(
      { documentId: id },
      { title, content },
      { new: true }
    );

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: document.documentId,
      title: document.title,
      content: document.content
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to update document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const document = await DocumentModel.findOneAndDelete({ documentId: id });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
