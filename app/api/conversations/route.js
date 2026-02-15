import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    await connectDB();

    // Get all conversations for the user
    const conversations = await Conversation.find({
      participants: decoded.id,
    })
      .populate('participants', 'name profilePicture')
      .sort({ lastMessageAt: -1 })
      .lean();

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== decoded.id
        );

        const unreadCount = await Message.countDocuments({
          conversationId: conv.participants.map(p => p._id.toString()).sort().join('-'),
          receiver: decoded.id,
          read: false,
        });

        return {
          ...conv,
          otherUser,
          unreadCount,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithUnread }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}