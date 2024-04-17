using ChatHub.DataService;
using ChatHub.Models;
using ChatHub.Services;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace ChatHub.Hubs
{
    public class JoinHub : Hub
    {
        private readonly RoomService _roomService;

        public JoinHub(RoomService roomService)
        {
            _roomService = roomService;
        }
        // private readonly SharedDB _sharedDB;
        // public JoinHub(SharedDB sharedDB)
        // {
        //     _sharedDB = sharedDB;
        // }
        // public async Task JoinChat(UserConnection conn){
        //     await Clients.All.SendAsync("ReceiveJoinUpdate", "user", $"{conn.Username} has joined Chatroom");
        // }

        // public async Task JoinSpecificChatroom(UserConnection conn){
        //     await Groups.AddToGroupAsync(Context.ConnectionId, conn.Chatroom);
        //     _sharedDB.Connections[Context.ConnectionId] = conn;
        //     await Clients.Group(conn.Chatroom).SendAsync("JoinSpecificChatRoom", "user", $"{conn.Username} has joined {conn.Chatroom}");
        // }

        // public async Task SendMessage(string message){
        //     if(_sharedDB.Connections.TryGetValue(Context.ConnectionId, out UserConnection conn)){
        //         await Clients.Group(conn.Chatroom).SendAsync("ReceiveSpecificMessage", conn.Username, message);
        //     }
        // }

        public async Task JoinSpecificChatroom(JoinRoomModel joinRoom)
        {
            // Check if the room exists
            var room = await _roomService.GetRoomById(joinRoom.RoomId);

            // Check if the user exists
            var user = await _roomService.GetUserById(joinRoom.UserId);

            // Add the user to the room
            room.Members.Add(joinRoom.UserId);
            await _roomService.UpdateRoom(room);

            await Clients.All.SendAsync("JoinSpecificChatRoom", $"{joinRoom.UserId} has joined {room.Name}");
        }

        public async Task SendMessage(string roomId, string senderId, string content)
        {
            var connectionId = Context.ConnectionId;
            // Create a Message object
            var message = new Message
            {
                RoomId = roomId,
                SenderId = senderId,
                Content = content,
                Timestamp = DateTime.UtcNow
            };

            // Store the message in MongoDB
            await _roomService.InsertMessage(message);

            // Get the list of active connections for the specified room
            // var roomConnections = await _roomService.GetRoomConnections(roomId);

            // Broadcast the message to all active connections in the room
            // foreach (var activeConnectionId in roomConnections.ActiveConnections)
            // {
            //     await Clients.Client(activeConnectionId).SendAsync("ReceiveMessage", message);
            // }
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        public async Task OnViewRoom(string roomId)
        {
            var connectionId = Context.ConnectionId;
            await _roomService.AddConnectionToRoom(roomId, connectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Remove the disconnected connection ID from all rooms
            await _roomService.RemoveConnectionFromAllRooms(Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}

