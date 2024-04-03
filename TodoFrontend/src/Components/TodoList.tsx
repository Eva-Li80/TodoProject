import React, { useEffect, useState } from "react";
import axios from "axios";
import { Todo } from "../type";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoContent, setNewTodoContent] = useState("");

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
      if (newTodoName.trim() !== "") {
        const todoToAdd: Todo = {
          id: 0, 
          title: newTodoName,
          content: newTodoContent,
          completed: false,
        };

        const response = await axios.post<Todo>(
          "http://localhost:5100/api/todos",
          todoToAdd
        );

        setTodos([...todos, response.data]);
        setNewTodoName("");
        setNewTodoContent("");
      }
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

  const handleUpdateTodo = async (id: number) => {
    try {
      const updatedTodo: Todo = {
        id: id,
        title: newTodoName, 
        content: newTodoContent, 
        completed: false
      };

      const response = await axios.put<Todo>(
        `http://localhost:5100/api/todos/${id}`,
        updatedTodo
      );

      const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
          return response.data; 
        }
        return todo;
      });

      setTodos(updatedTodos);
      console.log(`Todo with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodoName}
        onChange={(e) => setNewTodoName(e.target.value)}
        placeholder="Enter a new todo title"
      />
      <input
        type="text"
        value={newTodoContent}
        onChange={(e) => setNewTodoContent(e.target.value)}
        placeholder="Enter a new todo content"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.content} - {todo.completed ? "Completed" : "Not Completed"}
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
            <button onClick={() => handleUpdateTodo(todo.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
