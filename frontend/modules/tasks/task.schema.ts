import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "REVIEW"]),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;