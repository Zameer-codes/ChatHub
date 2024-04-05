using ChatHub.DataService;
using ChatHub.Hubs;
using ChatHub.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
// Add MongoDB configuration
var connectionString = "mongodb://localhost:27017/";
var client = new MongoClient(connectionString);
var database = client.GetDatabase("chathub");

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSingleton(database);
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<MessageService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<SharedDB>();

builder.Services.AddSignalR();

builder.Services.AddCors(opt=>{
    opt.AddPolicy("chatApp", builder =>{
        builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


app.UseCors("chatApp");

app.MapHub<JoinHub>("/JoinHub");

app.Run();
