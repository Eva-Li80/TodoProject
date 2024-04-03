
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// CORS configuration
app.UseCors(options =>
{
    options.WithOrigins("http://localhost:5173");
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    Console.WriteLine("CORS configuration applied");
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

Console.WriteLine("Application started");
