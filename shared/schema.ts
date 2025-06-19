import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  applicationLink: text("application_link").notNull(),
  status: text("status").notNull().$type<"applied" | "interviewing" | "rejected" | "offer">(),
  appliedDate: timestamp("applied_date").defaultNow().notNull(),
  aiSummary: text("ai_summary"),
  aiSkills: text("ai_skills").array(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  appliedDate: true,
}).extend({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  applicationLink: z.string().url("Must be a valid URL"),
  status: z.enum(["applied", "interviewing", "rejected", "offer"]),
});

export const updateJobSchema = insertJobSchema.partial().extend({
  id: z.number(),
});

export const aiAnalysisSchema = z.object({
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
export type AIAnalysisRequest = z.infer<typeof aiAnalysisSchema>;

export interface AIAnalysisResponse {
  summary: string;
  skills: {
    name: string;
    description: string;
  }[];
}
