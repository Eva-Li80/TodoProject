import React, { useEffect, useState } from "react";
import axios from "axios";
import { Todo } from "../type"


const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get<Todo[]>(
          "http://localhost:5100/api/todos"
        );
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    try {
      if (newTodo.trim() !== "") {
        // Skapa ett nytt todo-objekt med titeln
        const todoToAdd: Todo = {
          id: 0, // Vi behöver inte skicka id eftersom det genereras av servern
          title: newTodo,
          content: "",
          completed: false,
        };

        // Skicka POST-förfrågan med det nya todo-objektet
        const response = await axios.post<Todo>(
          "http://localhost:5100/api/todos",
          todoToAdd
        );

        // Uppdatera state med den nya todo som returneras från servern
        setTodos([...todos, response.data]);
      }
      // Återställ input-fältet
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5100/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      console.log(`Todo with ID ${id} removed successfully.`);
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };
  
  

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.content} - {todo.completed ? "Completed" : "Not Completed"}
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
