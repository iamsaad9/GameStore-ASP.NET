using GameStore.Api.Dtos;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


List<GameDto> games = [
  new(1,"Stret Fighter II","Action", 19.99m, new DateOnly(1991, 2, 6)),
    new(2,"The Legend of Zelda: Ocarina of Time","Adventure", 29.99m, new DateOnly(1998, 11, 21)),
    new(3,"Minecraft","Sandbox", 26.95m, new DateOnly(2011, 11, 18)),
];
// GET /games All games available in the store
app.MapGet("/games", () => games);

//Get /games/{id} Get a specific game by its ID
app.MapGet("/games/{id}", (int id) => games.Find(game => game.Id == id));
app.Run();
