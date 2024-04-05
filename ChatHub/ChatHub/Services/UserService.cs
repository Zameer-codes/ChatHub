using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatHub.Models;
using MongoDB.Driver;

namespace ChatHub.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

    public List<User> Get() =>
        _users.Find(user => true).ToList();

    public User Get(string id) =>
        _users.Find<User>(user => user.Id == id).FirstOrDefault();

    public User Create(User user)
    {
        _users.InsertOne(user);
        return user;
    }

    public void Update(string id, User userIn) =>
        _users.ReplaceOne(user => user.Id == id, userIn);

    public void Remove(string id) =>
        _users.DeleteOne(user => user.Id == id);
    }
}