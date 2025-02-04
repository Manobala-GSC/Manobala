import { Room, Message } from '../models/forumModel.js';

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}, 'name description type');
    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching rooms"
    });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId)
      .populate({
        path: 'messages',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.json({
      success: true,
      messages: room.messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages"
    });
  }
};

export const postMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const userId = req.body.userId; // From userAuth middleware

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    // Create and save the message
    const message = new Message({
      content,
      roomId,
      userId,
      timestamp: new Date()
    });

    await message.save();

    // Add message reference to room
    room.messages.push(message._id);
    await room.save();

    // Populate the message with user details before emitting
    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'name');

    // Emit the new message through Socket.IO
    req.app.get('io').to(roomId).emit('newMessage', populatedMessage);

    res.json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({
      success: false,
      message: "Error posting message"
    });
  }
}; 