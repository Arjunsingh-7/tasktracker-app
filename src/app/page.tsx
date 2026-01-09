import { TaskList } from "@/components/TaskList";
import { Toaster } from "@/components/ui/sonner";
import { CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-200 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none">
            <CheckSquare className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            TaskTracker
          </h1>
          <p className="mt-4 max-w-md text-balance text-zinc-500 dark:text-zinc-400">
            A refined workspace for your daily objectives. 
            Focus on what matters most, one task at a time.
          </p>
        </header>

        <section className="relative">
          <div className="absolute inset-0 -top-24 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_100%)] dark:bg-[radial-gradient(45%_40%_at_50%_50%,rgba(255,255,255,0.01)_0%,transparent_100%)]" />
          <TaskList />
        </section>
      </div>
      <Toaster position="bottom-right" richColors />
    </main>
  );
}
