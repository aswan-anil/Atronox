import { z } from "zod";

export const insertNewsletterSchema = z.object({
  email: z.string().email(),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

export interface Newsletter {
  id: number;
  email: string;
  createdAt: string;
}
