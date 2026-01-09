"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  due_date: z.date({
    required_error: "Due date is required",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSuccess: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          due_date: format(values.due_date, "yyyy-MM-dd"),
          status: "Pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      toast.success("Task created successfully");
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Title
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="What needs to be done?" 
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Description <span className="text-zinc-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add some context or details..."
                  className="min-h-[100px] resize-none rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Priority
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="Low">Low Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Due Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-11 w-full rounded-xl border-zinc-200 bg-zinc-50/50 pl-3 text-left font-normal dark:border-zinc-800 dark:bg-zinc-900/50",
                          !field.value && "text-zinc-400"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-[2rem] border-none shadow-2xl" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="rounded-[2rem]"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-zinc-900 font-semibold text-white shadow-lg shadow-zinc-200 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Objective"
          )}
        </Button>
      </form>
    </Form>
  );
}
