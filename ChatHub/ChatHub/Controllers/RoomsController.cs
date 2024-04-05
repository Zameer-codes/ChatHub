using ChatHub.Models;
using ChatHub.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ChatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomsController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public List<Room> Get()
        {
            return _roomService.Get();
        }

        [HttpGet("{id:length(24)}", Name = "GetRoom")]
        public Room Get(string id)
        {
            return _roomService.Get(id);
        }

        [HttpPost]
        public Room Create(Room room)
        {
            return _roomService.Create(room);
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
