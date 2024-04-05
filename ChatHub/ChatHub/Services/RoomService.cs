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

    public RoomService(IMongoDatabase database)
    {
        _rooms = database.GetCollection<Room>("Rooms");
    }

    public List<Room> Get() =>
        _rooms.Find(room => true).ToList();

    public Room Get(string id) =>
        _rooms.Find<Room>(room => room.Id == id).FirstOrDefault();

    public Room Create(Room room)
    {
        _rooms.InsertOne(room);
        return room;
    }

    public void Update(string id, Room roomIn) =>
        _rooms.ReplaceOne(room => room.Id == id, roomIn);

    public void Remove(string id) =>
        _rooms.DeleteOne(room => room.Id == id);
    }
}