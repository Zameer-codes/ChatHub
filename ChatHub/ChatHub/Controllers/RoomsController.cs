using ChatHub.Hubs;
using ChatHub.Models;
using ChatHub.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;

namespace ChatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IHubContext<JoinHub> _joinHubContext;
        private readonly RoomService _roomService;

        public RoomsController(RoomService roomService, IHubContext<JoinHub> joinHubContext)
        {
            _roomService = roomService;
            _joinHubContext = joinHubContext;
        }

        [HttpGet]
        public List<Room> Get()
        {
            return _roomService.Get();
        }

        [HttpGet("user/{userId}")]
        public List<Room> GetRoomsByUser(string userId)
        {
            var rooms = _roomService.GetRoomsByUser(userId);
            return rooms;
        }

        [HttpPost("createRoom")]
        public Room CreateRoom([FromBody] CreateRoomModel createRoomModel)
        {
            var createdRoom = _roomService.Create(createRoomModel.RoomName, createRoomModel.UserId);
            return createdRoom;
        }

        [HttpPost("join-room/{roomId}/{userId}")]
        public async Task<ActionResult> JoinRoom(string roomId, string userId)
        {
            // Check if the room exists
            var room = await _roomService.GetRoomById(roomId);
            if (room == null)
            {
                return NotFound("Room not found");
            }

            // Check if the user exists
            var user = await _roomService.GetUserById(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Add the user to the room
            room.Members.Add(userId);
            await _roomService.UpdateRoom(room);

            // Notify clients about the user joining the room
            await _joinHubContext.Clients.Group(roomId).SendAsync("UserJoinedRoom", userId, room.Name);

            return Ok("Joined room successfully");
        }


        [HttpPut("{id:length(24)}")]
        public void Update(string id, Room roomIn)
        {
            _roomService.Update(id, roomIn);
        }

        [HttpDelete("{id:length(24)}")]
        public void Delete(string id)
        {
            _roomService.Remove(id);
        }
    }
}
