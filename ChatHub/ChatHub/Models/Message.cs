using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatHub.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string RoomId { get; set; } // Reference to the room in which the message was sent

        public string SenderId { get; set; } // Reference to the user who sent the message

        public string Content { get; set; }

        public DateTime Timestamp { get; set; }
    }
}