using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatHub.Models;
using MongoDB.Driver;

namespace ChatHub.Services
{
    public class RoomService
    {
        private readonly IMongoCollection<Room> _rooms;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Message> _messages;
        private readonly IMongoCollection<RoomConnection> _roomsConnections;

        public RoomService(IMongoDatabase database)
        {
            _rooms = database.GetCollection<Room>("Rooms");
            _users = database.GetCollection<User>("Users");
            _messages = database.GetCollection<Message>("Messages");
            _roomsConnections = database.GetCollection<RoomConnection>("RoomConnections");

        }

        public List<Room> Get() =>
            _rooms.Find(room => true).ToList();

        // Get rooms joined by a specific user
        public List<Room> GetRoomsByUser(string userId)
        {
            return _rooms.Find(room => room.Members.Contains(userId)).ToList();
        }

        public Room Create(string roomName, string userId)
        {
            var room = new Room
            {
                Name = roomName,
                CreatorId = userId,
                CreatedAt = DateTime.UtcNow,
                Members = new List<string> { userId }
            };

            _rooms.InsertOne(room);
            return room;
        }

        public async Task<Room> GetRoomById(string id)
        {
            var filter = Builders<Room>.Filter.Eq(r => r.Id, id);
            return await _rooms.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserById(string id)
        {
            var filter = Builders<User>.Filter.Eq(r => r.Id, id);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpdateRoom(Room room)
        {
            var filter = Builders<Room>.Filter.Eq(r => r.Id, room.Id);
            await _rooms.ReplaceOneAsync(filter, room);
        }

        public void Update(string id, Room roomIn) =>
            _rooms.ReplaceOne(room => room.Id == id, roomIn);

        public void Remove(string id) =>
            _rooms.DeleteOne(room => room.Id == id);

        public async Task InsertMessage(Message message) =>
            await _messages.InsertOneAsync(message);


        public async Task AddConnectionToRoom(string roomId, string connectionId)
        {
            var filter = Builders<RoomConnection>.Filter.Eq(rc => rc.RoomId, roomId);
            var roomConnection = await _roomsConnections.Find(filter).FirstOrDefaultAsync();

            if (roomConnection != null)
            {
                // Check if the connection ID already exists in the list of active connections
                if (!roomConnection.ActiveConnections.Contains(connectionId))
                {
                    var update = Builders<RoomConnection>.Update.AddToSet(rc => rc.ActiveConnections, connectionId);
                    await _roomsConnections.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
                }
            }
            else
            {
                // RoomConnection document does not exist, create a new one
                var newRoomConnection = new RoomConnection
                {
                    RoomId = roomId,
                    ActiveConnections = new List<string> { connectionId }
                };
                await _roomsConnections.InsertOneAsync(newRoomConnection);
            }
        }

        public async Task<RoomConnection> GetRoomConnections(string roomId)
        {
            var filter = Builders<RoomConnection>.Filter.Eq(rc => rc.RoomId, roomId);
            return await _roomsConnections.Find(filter).FirstOrDefaultAsync();
        }
        public async Task RemoveConnectionFromAllRooms(string connectionId)
        {
            var filter = Builders<RoomConnection>.Filter.Empty; // Match all documents
            var update = Builders<RoomConnection>.Update.Pull(rc => rc.ActiveConnections, connectionId);
            await _roomsConnections.UpdateManyAsync(filter, update);
        }

    }
}