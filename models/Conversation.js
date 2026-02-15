import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure participants array has exactly 2 users
ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);