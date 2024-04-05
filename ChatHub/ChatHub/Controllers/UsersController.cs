using ChatHub.Models;
using ChatHub.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ChatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public List<User> Get()
        {
            return _userService.Get();
        }

        [HttpGet("{id:length(24)}", Name = "GetUser")]
        public User Get(string id)
        {
            return _userService.Get(id);
        }

        [HttpPost]
        public User Create(User user)
        {
            return _userService.Create(user);
        }

        [HttpPut("{id:length(24)}")]
        public void Update(string id, User userIn)
        {
            _userService.Update(id, userIn);
        }

        [HttpDelete("{id:length(24)}")]
        public void Delete(string id)
        {
            _userService.Remove(id);
        }
    }
}
