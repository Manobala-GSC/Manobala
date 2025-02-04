function RoomList({ rooms, activeRoom, onRoomSelect }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Support Rooms</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => onRoomSelect(room)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
              activeRoom?._id === room._id ? "bg-gray-600" : ""
            }`}
          >
            <h3 className="font-medium text-gray-100">{room.name}</h3>
            <p className="text-sm text-gray-400">{room.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default RoomList

