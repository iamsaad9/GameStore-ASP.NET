using GameStore.Api.Dtos;
using Microsoft.VisualBasic;
namespace GameStore.Api.Endpoints;

public static class GamesEndpoints

{
    const string GetGameEndpointName = "GetGame";
    private static readonly List<GameDto> games = [
        new(1,"Stret Fighter II","Action", 19.99m, new DateOnly(1991, 2, 6)),
        new(2,"The Legend of Zelda: Ocarina of Time","Adventure", 29.99m, new DateOnly(1998, 11, 21)),
        new(3,"Minecraft","Sandbox", 26.95m, new DateOnly(2011, 11, 18)),
    ];

    public static void MapGameEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/games");
        // GET /games All games available in the store
        group.MapGet("/", () => games);


        //Get /games/{id} Get a specific game by its ID
        group.MapGet("/{id}", (int id) =>
        {
            var game = games.Find(game => game.Id == id);
            return game is null ? Results.NotFound() : Results.Ok(game);
        })
        .WithName(GetGameEndpointName);

        //Posting a new game to the store
        group.MapPost("/", (CreateGameDto newGame) =>
        {

            GameDto game = new(
    games.Count + 1,
    newGame.Name,
    newGame.Genre,
    newGame.Price,
    newGame.ReleaseDate
    );

            games.Add(game);

            return Results.CreatedAtRoute(GetGameEndpointName, new { id = game.Id }, game);
        });

        //Update any game
        group.MapPut("/{id}", (int id, UpdateGameDto updatedGame) =>
        {
            var index = games.FindIndex(game => game.Id == id);

            if (index == -1)
            {
                return Results.NotFound();
            }

            games[index] = new GameDto(
    id,
    updatedGame.Name,
    updatedGame.Genre,
    updatedGame.Price,
    updatedGame.ReleaseDate
    );

            return Results.NoContent();
        });

        //Delete any game
        group.MapDelete("/{id}", (int id) =>
        {
            games.RemoveAll(game => game.Id == id);

            return Results.NoContent();
        });

    }

}
