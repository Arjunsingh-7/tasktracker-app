"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, PlusCircle, LayoutList } from "lucide-react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

    return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-6 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            Current Focus
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage and track your active objectives
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 px-5 rounded-xl font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-semibold">New Objective</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-4">
              <TaskForm onSuccess={() => {
                setIsDialogOpen(false);
                fetchTasks();
              }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 dark:bg-zinc-800">
            <LayoutList className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            No tasks yet
          </h3>
          <p className="mt-2 max-w-[240px] text-sm text-zinc-500 dark:text-zinc-400">
            Add your first objective to begin tracking your progress.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            onClick={() => setIsDialogOpen(true)}
          >
            Create your first task
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
}
