"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTodos } from "@/lib/hooks/use-todos";
import { useRef, useMemo } from "react";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const {
    todos,
    error,
    isLoading,
    newTodo,
    setNewTodo,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
  } = useTodos();

  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    await handleAddTodo();
    // Focus the title input after submission
    titleInputRef.current?.focus();
  };

  // Memoize the todo list to prevent unnecessary re-renders
  const todoList = useMemo(() => {
    if (isLoading && todos.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      );
    }

    return todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={isLoading}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
      />
    ));
  }, [todos, isLoading, handleToggleTodo, handleDeleteTodo, handleUpdateTodo]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {error && (
        <div className="p-4 text-sm border border-destructive bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={titleInputRef}
          type="text"
          placeholder="Title..."
          value={newTodo.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodo({
              ...newTodo,
              title: e.target.value,
            })
          }
          className="flex-1 bg-background"
        />
        <Input
          type="text"
          placeholder="Description..."
          value={newTodo.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodo({
              ...newTodo,
              description: e.target.value,
            })
          }
          className="flex-1 bg-background"
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
          Add
        </Button>
      </form>

      <div className="space-y-2">{todoList}</div>
    </div>
  );
}
