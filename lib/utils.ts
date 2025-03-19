import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface TodoCreate {
  title: string;
  description: string;
  completed: boolean;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function fetchTodos(): Promise<Todo[]> {
  if (!API_ENDPOINT) {
    throw new Error(
      "API endpoint is not configured. Please check your environment variables."
    );
  }

  try {
    const url = `${API_ENDPOINT}/todos/`;
    const response = await fetch(url, {
      method: "GET",
      headers: defaultHeaders,
      mode: "cors",
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function createTodo(todo: TodoCreate): Promise<Todo> {
  if (!API_ENDPOINT) {
    throw new Error(
      "API endpoint is not configured. Please check your environment variables."
    );
  }

  try {
    const url = `${API_ENDPOINT}/todos/`;
    const response = await fetch(url, {
      method: "POST",
      headers: defaultHeaders,
      mode: "cors",
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

export async function updateTodo(
  id: number,
  todo: { title: string; description: string; completed: boolean }
): Promise<Todo> {
  if (!API_ENDPOINT) {
    throw new Error(
      "API endpoint is not configured. Please check your environment variables."
    );
  }

  try {
    const url = `${API_ENDPOINT}/todos/${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: defaultHeaders,
      mode: "cors",
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    if (response.status === 204) {
      return {
        id,
        ...todo,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

export async function deleteTodo(id: number): Promise<void> {
  if (!API_ENDPOINT) {
    throw new Error(
      "API endpoint is not configured. Please check your environment variables."
    );
  }

  try {
    const url = `${API_ENDPOINT}/todos/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: defaultHeaders,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    if (response.status === 204) {
      return;
    }

    const data = await response.json();
    if (data.message && data.message !== "Todo deleted successfully") {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}
