import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AppContent } from "../context/AppContext"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import RoomList from "../components/forum/RoomList"
import MessageThread from "../components/forum/MessageThread"
import io from "socket.io-client"

function Forum() {
  const navigate = useNavigate()
  const { backendUrl, isLoggedin, userData } = useContext(AppContent)
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
          withCredentials: true,
        })

        if (!data.success) {
          navigate("/login")
          return
        }

        // Initialize Socket.IO connection
        const newSocket = io(backendUrl)
        setSocket(newSocket)

        // Fetch rooms
        fetchRooms()
        setLoading(false)

        return () => {
          if (newSocket) newSocket.close()
        }
      } catch (error) {
        navigate("/login")
      }
    }

    checkAuth()
  }, [backendUrl]) // Added backendUrl to dependencies

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/forum/rooms`, {
        withCredentials: true,
      })
      if (data.success) {
        setRooms(data.rooms)
      }
    } catch (error) {
      toast.error("Error fetching rooms")
    }
  }

  const handleRoomSelect = (room) => {
    if (activeRoom) {
      socket.emit("leaveRoom", activeRoom._id)
    }
    setActiveRoom(room)
    socket.emit("joinRoom", room._id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="pt-100 sm:pt-0">
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex h-[calc(100vh-8rem)]">
          <div className="w-64 flex-shrink-0 bg-gray-800 rounded-l-lg overflow-hidden">
            <RoomList rooms={rooms} activeRoom={activeRoom} onRoomSelect={handleRoomSelect} />
          </div>
          <div className="flex-grow bg-gray-700 rounded-r-lg overflow-hidden">
            {activeRoom ? (
              <MessageThread room={activeRoom} socket={socket} backendUrl={backendUrl} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a room to start participating in the discussion
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forum

