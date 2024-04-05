using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatHub.Models
{
    public class Room
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string CreatorId { get; set; } // Reference to the user who created the room

        public DateTime CreatedAt { get; set; }

        public List<string> Members { get; set; } // References to the users who are members of the room
    }
}