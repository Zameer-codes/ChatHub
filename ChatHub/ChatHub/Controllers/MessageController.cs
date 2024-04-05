using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ChatHub.Models;
using ChatHub.Services;

namespace ChatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly MessageService _messageService;

        public MessagesController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet]
        public List<Message> Get()
        {
            return _messageService.Get();
        }

        [HttpGet("{roomId}")]
        public List<Message> GetByRoom(string roomId)
        {
            return _messageService.Get(roomId);
        }

        [HttpPost]
        public void Create(Message message)
        {
            _messageService.Create(message);
        }

        [HttpPut("{id}")]
        public void Update(string id, Message messageIn)
        {
            var message = _messageService.Get(id);

            if (message != null)
            {
                _messageService.Update(id, messageIn);
            }
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            var message = _messageService.Get(id);

            if (message != null)
            {
                _messageService.Remove(id);
            }
        }
    }
}
