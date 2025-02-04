import express from 'express';
import { getRooms, getRoomMessages, postMessage } from '../controllers/forumController.js';
import userAuth from '../middleware/userAuth.js';

const forumRouter = express.Router();

forumRouter.get('/rooms', userAuth, getRooms);
forumRouter.get('/rooms/:roomId/messages', userAuth, getRoomMessages);
forumRouter.post('/rooms/:roomId/messages', userAuth, postMessage);

export default forumRouter; 