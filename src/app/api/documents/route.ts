import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Extract the sessionId from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const documents = await DocumentModel.find({ sessionId }).sort({ updatedAt: -1 });

    // Format for frontend
    const formattedDocs = documents.map(doc => ({
      id: doc.documentId,
      title: doc.title,
      content: doc.content
    }));

    return NextResponse.json(formattedDocs, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { sessionId, title, content } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const newDocument = new DocumentModel({
      documentId: uuidv4(),
      sessionId,
      title: title || 'Untitled Document',
      content: content || ''
    });

    await newDocument.save();

    return NextResponse.json({
      id: newDocument.documentId,
      title: newDocument.title,
      content: newDocument.content
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
