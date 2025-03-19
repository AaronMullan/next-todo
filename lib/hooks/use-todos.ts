import { useState, useEffect } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  type Todo,
  type TodoCreate,
} from "@/lib/utils";

interface UseTodosReturn {
  todos: Todo[];
  error: string | null;
  isLoading: boolean;
  newTodo: { title: string; description: string };
  setNewTodo: (todo: { title: string; description: string }) => void;
  handleAddTodo: () => Promise<void>;
  handleToggleTodo: (id: number, completed: boolean) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleUpdateTodo: (id: number, todo: Omit<Todo, "id">) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return;
    try {
      setIsLoading(true);
      const todoData: TodoCreate = {
        ...newTodo,
        completed: false,
      };
      const todo = await createTodo(todoData);
      setTodos((prev) => [...prev, todo]);
      setNewTodo({ title: "", description: "" });
    } catch (err) {
      setError("Failed to add todo");
      console.error("Error adding todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      setIsLoading(true);
      // Update local state immediately for better UX
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      await updateTodo(id, { ...todo, completed });
    } catch (err) {
      // Revert the local state if the API call fails
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (id: number, todo: Omit<Todo, "id">) => {
    try {
      setIsLoading(true);
      // Get the current todo to ensure we have the latest state
      const currentTodo = todos.find((t) => t.id === id);
      if (!currentTodo) {
        throw new Error("Todo not found");
      }

      // Ensure we're sending the correct completion status
      const updateData = {
        ...todo,
        completed: currentTodo.completed, // Use the current completion status
      };
      const updatedTodo = await updateTodo(id, updateData);

      setTodos((prev) => {
        const newTodos = prev.map((t) =>
          t.id === id ? { ...t, ...updatedTodo } : t
        );
        return newTodos;
      });
    } catch (err) {
      console.error("Error in handleUpdateTodo:", err);
      setError("Failed to update todo");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    todos,
    error,
    isLoading,
    newTodo,
    setNewTodo,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
  };
}
