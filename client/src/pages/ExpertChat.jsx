import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { io } from 'socket.io-client';

function ExpertChat() {
    const { backendUrl, userData } = useContext(AppContent);
    const [experts, setExperts] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef();
    const messagesEndRef = useRef(null);

    // Check if user is expert based on their isExpert field
    const isExpert = useMemo(() => {
        console.log('Checking expert status with userData:', userData);
        return userData?.isExpert === true;
    }, [userData?.isExpert]);

    useEffect(() => {
        // Initialize socket connection with proper configuration
        socket.current = io(backendUrl, {
            path: '/socket.io/',
            transports: ['polling', 'websocket'],
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            autoConnect: true,
            forceNew: true
        });

        // Socket connection handlers
        socket.current.on('connect', () => {
            console.log('Connected to socket server:', socket.current.id);
            console.log('Current user data:', userData);
            console.log('Is user expert?', isExpert);
            
            // Only fetch experts if user is not an expert
            if (!isExpert) {
                fetchExperts();
            }
            fetchChats();
        });

        socket.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            toast.error(`Connection error: ${error.message}. Retrying...`);
        });

        socket.current.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Reconnect if server disconnected
                socket.current.connect();
            }
        });

        return () => {
            if (socket.current) {
                socket.current.removeAllListeners();
                socket.current.disconnect();
            }
        };
    }, [backendUrl, isExpert]);

    useEffect(() => {
        if (!socket.current?.connected) {
            console.log('Socket not connected, attempting to connect...');
            socket.current?.connect();
            return;
        }

        // Listen for new messages
        socket.current.on('expertChatMessage', (data) => {
            console.log('Received message:', data);
            if (currentChat?._id === data.chatId) {
                setMessages(prev => {
                    // Generate a unique ID for the new message
                    const messageId = data.message._id || 
                        `${Date.now()}-${data.message.sender._id}-${Math.random().toString(36).substr(2, 9)}`;

                    // Check if message already exists
                    const messageExists = prev.some(msg => 
                        msg._id === messageId || 
                        (msg.timestamp === data.message.timestamp && 
                         msg.sender._id === data.message.sender._id && 
                         msg.content === data.message.content)
                    );

                    if (messageExists) return prev;
                    
                    const newMessage = {
                        _id: messageId,
                        content: data.message.content,
                        sender: {
                            _id: data.message.sender._id,
                            name: data.message.sender.name,
                            email: data.message.sender.email
                        },
                        timestamp: data.message.timestamp || new Date().toISOString()
                    };

                    return [...prev, newMessage];
                });

                // Scroll to bottom
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
            // Refresh chat list to update last message time
            fetchChats();
        });

        // Listen for room join confirmation
        socket.current.on('joinedRoom', (data) => {
            console.log('Successfully joined room:', data.room);
        });

        return () => {
            if (socket.current) {
                socket.current.off('expertChatMessage');
                socket.current.off('joinedRoom');
            }
        };
    }, [currentChat, socket.current?.connected]);

    useEffect(() => {
        // Scroll to bottom on new messages
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchExperts = async () => {
        // Only fetch experts if user is not an expert
        if (isExpert) return;
        
        try {
            const { data } = await axios.get(`${backendUrl}/api/expert-chat/experts`, {
                withCredentials: true
            });
            if (data.success) {
                const filteredExperts = data.experts.filter(expert => expert._id !== userData?._id);
                setExperts(filteredExperts);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching experts');
        }
    };

    const fetchChats = async () => {
        try {
            console.log('Fetching chats for user:', userData);
            console.log('Is user expert?', isExpert);
            
            const { data } = await axios.get(`${backendUrl}/api/expert-chat/chats`, {
                withCredentials: true
            });
            console.log('Raw chat data from server:', data);

            if (data.success) {
                // Sort chats by last message timestamp
                const sortedChats = data.chats.sort((a, b) => {
                    const timeA = new Date(a.lastMessage || a.createdAt).getTime();
                    const timeB = new Date(b.lastMessage || b.createdAt).getTime();
                    return timeB - timeA;
                });

                console.log('Sorted chats:', sortedChats);
                console.log('First chat user data:', sortedChats[0]?.user);
                setChats(sortedChats);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Error fetching chats');
        }
    };

    const startChat = async (expertId) => {
        try {
            // Prevent chatting with self
            if (expertId === userData?._id) {
                toast.error("You cannot start a chat with yourself");
                return;
            }

            // Check if chat already exists
            const existingChat = chats.find(chat => chat.expert._id === expertId);
            if (existingChat) {
                loadMessages(existingChat);
                return;
            }

            const { data } = await axios.post(`${backendUrl}/api/expert-chat/chats`, {
                expertId
            }, {
                withCredentials: true
            });
            if (data.success) {
                setChats(prev => [data.chat, ...prev]);
                loadMessages(data.chat);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error starting chat');
        }
    };

    const loadMessages = async (chat) => {
        try {
            console.log('Loading messages for chat:', chat);
            console.log('Chat user data:', chat.user);
            
            if (currentChat?._id) {
                socket.current.emit('leaveExpertChat', currentChat._id);
            }
            
            setCurrentChat(chat);
            socket.current.emit('joinExpertChat', chat._id);
            
            const { data } = await axios.get(`${backendUrl}/api/expert-chat/chats/${chat._id}/messages`, {
                withCredentials: true
            });
            console.log('Messages data:', data);
            
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Error loading messages');
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat) return;

        try {
            const { data } = await axios.post(`${backendUrl}/api/expert-chat/chats/${currentChat._id}/messages`, {
                content: newMessage.trim()
            }, {
                withCredentials: true
            });
            
            if (data.success) {
                // Don't update messages here, let the socket handle it
                setNewMessage('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending message');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Experts/Chats List */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
                        {console.log('Is user expert?', isExpert)}
                        {isExpert ? (
                            // Expert View - Only Active Chats with User Names
                            <div className="h-full">
                                {console.log('Rendering expert view with chats:', chats)}
                                <h2 className="text-xl font-bold mb-4">Active Chats</h2>
                                <div className="space-y-2">
                                    {chats.length > 0 ? (
                                        chats.map(chat => {
                                            console.log('Processing chat in render:', chat);
                                            console.log('User data in chat:', chat.user);
                                            
                                            return (
                                                <div
                                                    key={`chat-${chat._id}`}
                                                    className={`p-3 rounded-lg cursor-pointer transition ${
                                                        currentChat?._id === chat._id 
                                                            ? 'bg-blue-50 border border-blue-200' 
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => loadMessages(chat)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {chat.user?.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {chat.user?.email}
                                                            </p>
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                                                    User
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {chat.lastMessage && (
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(chat.lastMessage).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {chat.messages && chat.messages.length > 0 && (
                                                        <p className="text-sm text-gray-600 mt-2 truncate">
                                                            {chat.messages[chat.messages.length - 1]?.content}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            No active chats
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Regular User View - Available Experts and Active Chats
                            <div className="h-full flex flex-col">
                                {/* Available Experts Section */}
                                
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-4">Available Experts</h2>
                                    <div className="space-y-2">
                                        {experts.length > 0 ? (
                                            experts.map(expert => (
                                                <div
                                                    key={`expert-${expert._id}`}
                                                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                                                    onClick={() => startChat(expert._id)}
                                                >
                                                    <p className="font-medium text-gray-800">{expert.name}</p>
                                                    <p className="text-sm text-gray-500">{expert.email}</p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Expert</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-center py-4">
                                                No experts available at the moment
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Chats Section */}
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold mb-4">Active Chats</h2>
                                    <div className="space-y-2">
                                        {chats.length > 0 ? (
                                            chats.map(chat => (
                                                <div
                                                    key={`chat-${chat._id}`}
                                                    className={`p-3 rounded-lg cursor-pointer transition ${
                                                        currentChat?._id === chat._id 
                                                            ? 'bg-blue-50 border border-blue-200' 
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => loadMessages(chat)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{chat.expert.name}</p>
                                                            <p className="text-sm text-gray-500">{chat.expert.email}</p>
                                                        </div>
                                                        {chat.lastMessage && (
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(chat.lastMessage).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {chat.messages && chat.messages.length > 0 && (
                                                        <p className="text-sm text-gray-600 mt-2 truncate">
                                                            {chat.messages[chat.messages.length - 1]?.content}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-center py-4">
                                                No active chats
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Messages */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow">
                        {currentChat ? (
                            <div className="h-[600px] flex flex-col">
                                {/* Chat Header */}
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">
                                            Chat with {userData?.isExpert ? currentChat.user.name : currentChat.expert.name}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {userData?.isExpert ? 'User' : 'Expert'}
                                        </span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {messages.length > 0 ? (
                                        messages.map((message) => (
                                            <div
                                                key={`message-${message._id}`}
                                                className={`mb-4 flex ${
                                                    message.sender._id === userData?._id ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${
                                                        message.sender._id === userData?._id
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <p>{message.content}</p>
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 mt-4">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="h-[600px] flex items-center justify-center text-gray-500">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpertChat; 