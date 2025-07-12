import type { Newsletter, InsertNewsletter } from "./schema";

export interface IStorage {
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterByEmail(email: string): Promise<Newsletter | undefined>;
}

export class MemStorage implements IStorage {
  private newsletters: Map<number, Newsletter>;
  private emailToId: Map<string, number>;
  currentId: number;

  constructor() {
    this.newsletters = new Map();
    this.emailToId = new Map();
    this.currentId = 1;
  }

  async createNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existingId = this.emailToId.get(insertNewsletter.email);
    if (existingId) {
      const existing = this.newsletters.get(existingId);
      if (existing) {
        throw new Error("Email already subscribed");
      }
    }

    const id = this.currentId++;
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      createdAt: new Date().toISOString(),
    };
    
    this.newsletters.set(id, newsletter);
    this.emailToId.set(insertNewsletter.email, id);
    return newsletter;
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    const id = this.emailToId.get(email);
    if (!id) return undefined;
    return this.newsletters.get(id);
  }
}

export const storage = new MemStorage();
