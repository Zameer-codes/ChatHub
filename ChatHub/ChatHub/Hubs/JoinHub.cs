using ChatHub.DataService;
using ChatHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatHub.Hubs
{
    public class JoinHub : Hub
    {
        private readonly SharedDB _sharedDB;
        public JoinHub(SharedDB sharedDB)
        {
            _sharedDB = sharedDB;
        }
        public async Task JoinChat(UserConnection conn){
            await Clients.All.SendAsync("ReceiveJoinUpdate", "user", $"{conn.Username} has joined Chatroom");
        }

        public async Task JoinSpecificChatroom(UserConnection conn){
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.Chatroom);
            _sharedDB.Connections[Context.ConnectionId] = conn;
            await Clients.Group(conn.Chatroom).SendAsync("JoinSpecificChatRoom", "user", $"{conn.Username} has joined {conn.Chatroom}");
        }

        public async Task SendMessage(string message){
            if(_sharedDB.Connections.TryGetValue(Context.ConnectionId, out UserConnection conn)){
                await Clients.Group(conn.Chatroom).SendAsync("ReceiveSpecificMessage", conn.Username, message);
            }
        }
    }
}

