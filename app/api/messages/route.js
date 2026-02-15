import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import { verifyToken } from '@/lib/auth';

// GET - Fetch messages for a conversation
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();

    // Create conversation ID (consistent ordering)
    const conversationId = [decoded.id, otherUserId].sort().join('-');

    // Fetch messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: decoded.id, read: false },
      { read: true }
    );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Send a new message
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { receiverId, content } = await request.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver and content required' }, { status: 400 });
    }

    await connectDB();

    // Create conversation ID
    const conversationId = [decoded.id, receiverId].sort().join('-');

    // Create message
    const message = await Message.create({
      sender: decoded.id,
      receiver: receiverId,
      content: content.trim(),
      conversationId,
    });

    // Update or create conversation
    await Conversation.findOneAndUpdate(
      { participants: { $all: [decoded.id, receiverId] } },
      {
        participants: [decoded.id, receiverId],
        lastMessage: content.trim(),
        lastMessageAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Populate sender info
    await message.populate('sender', 'name profilePicture');

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}