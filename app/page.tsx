import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">NextJS Todo App</h1>
        <h2 className="text-lg text-center mb-8">
          Connected to a FastAPI Backend
        </h2>
        <TodoList />
      </div>
    </main>
  );
}
