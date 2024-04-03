using Microsoft.AspNetCore.Mvc;



[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private static List<Todo> _todos = new List<Todo>
    {
        new() { Id = 1, Title = "Todo 1", Content = "lite text om todo ett", Completed = false },
        new() { Id = 2, Title = "Todo 2", Content = "lite text om todo två", Completed = true }
    };

    private readonly ILogger<TodosController> _logger;

    public TodosController(ILogger<TodosController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Todo>> GetTodos()
    {
        _logger.LogInformation("Fetching todos...");
        return Ok(_todos);
    }

    [HttpPost]
    public ActionResult<Todo> CreateTodo(Todo todo)
    {
        try
        {
            if (todo == null)
            {
                return BadRequest("Invalid todo object.");
            }

            todo.Id = _todos.Count + 1;

            _todos.Add(todo);

            _logger.LogInformation($"Created new todo with ID: {todo.Id}");

            return CreatedAtAction(nameof(GetTodoById), new { id = todo.Id }, todo);
        }
        catch (Exception ex)
        {
            _logger.LogError($"An error occurred while creating the todo: {ex.Message}");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [HttpGet("{id}")]
    public ActionResult<Todo> GetTodoById(int id)
    {
        var todo = _todos.Find(t => t.Id == id);
        if (todo == null)
        {
            return NotFound($"Todo with ID {id} not found.");
        }
        return Ok(todo);
    }


    [HttpDelete("{id}")]
    public IActionResult DeleteTodoById(int id)
    {
        var todoToRemove = _todos.FirstOrDefault(t => t.Id == id);
        if (todoToRemove == null)
        {
            return NotFound($"Todo with ID {id} not found.");
        }

        _todos.Remove(todoToRemove);
        _logger.LogInformation($"Deleted todo with ID: {id}");
        return NoContent();
    }


    [HttpPut("{id}")]
    public IActionResult UpdateTodo(int id, Todo updatedTodo)
    {

        var existingTodo = _todos.FirstOrDefault(t => t.Id == id);
        if (existingTodo == null)
        {
            return NotFound($"Todo with ID {id} not found.");
        }

        existingTodo.Title = updatedTodo.Title;
        existingTodo.Content = updatedTodo.Content;
        existingTodo.Completed = updatedTodo.Completed;


        return Ok(existingTodo);
    }


}