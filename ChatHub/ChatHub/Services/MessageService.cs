using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatHub.Models;
using MongoDB.Driver;

namespace ChatHub.Services
{
    public class MessageService
    {
        private readonly IMongoCollection<Message> _messages;

    public MessageService(IMongoDatabase database)
    {
        _messages = database.GetCollection<Message>("Messages");
    }

    public List<Message> Get() =>
        _messages.Find(message => true).ToList();

    public List<Message> Get(string roomId) =>
        _messages.Find(message => message.RoomId == roomId).ToList();


    public Message Create(Message message)
    {
        _messages.InsertOne(message);
        return message;
    }

    public void Update(string id, Message messageIn) =>
        _messages.ReplaceOne(message => message.Id == id, messageIn);

    public void Remove(string id) =>
        _messages.DeleteOne(message => message.Id == id);
    }
}