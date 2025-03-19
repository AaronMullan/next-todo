import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, todo: Omit<Todo, "id">) => Promise<void>;
}

export function TodoItem({
  todo,
  isLoading,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [editingTodo, setEditingTodo] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      await onUpdate(editingTodo.id, {
        title: editingTodo.title,
        description: editingTodo.description,
        completed: todo.completed,
      });
      setEditingTodo(null);
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };

  return (
    <Card className="p-4 bg-card">
      <div className="flex items-center gap-4">
        <Button
          variant={todo.completed ? "default" : "secondary"}
          size="sm"
          onClick={() => onToggle(todo.id, !todo.completed)}
          className="min-w-[80px]"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
          {todo.completed ? "Done" : "To Do"}
        </Button>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                todo.completed && "line-through"
              )}
            >
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Popover
            open={editingTodo?.id === todo.id}
            onOpenChange={(open) => {
              if (open) {
                setEditingTodo({
                  id: todo.id,
                  title: todo.title,
                  description: todo.description || "",
                });
              } else {
                setEditingTodo(null);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Edit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Title..."
                    value={editingTodo?.title || ""}
                    onChange={(e) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="bg-background"
                  />
                  <Input
                    type="text"
                    placeholder="Description..."
                    value={editingTodo?.description || ""}
                    onChange={(e) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    className="bg-background"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </PopoverContent>
          </Popover>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
