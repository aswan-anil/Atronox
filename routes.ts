import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertNewsletterSchema } from "./schema";
import { z } from "zod";
import { db } from "./firebase-admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists in Firestore
      const existingQuery = await db.collection("newsletter_subscriptions")
        .where("email", "==", validatedData.email)
        .limit(1)
        .get();
      if (!existingQuery.empty) {
        return res.status(409).json({
          message: "Email is already subscribed to our newsletter"
        });
      }

      // Store in Firestore
      let docRef;
      try {
        docRef = await db.collection("newsletter_subscriptions").add({
          email: validatedData.email,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error("Failed to write to Firestore:", firestoreError);
        return res.status(500).json({
          message: "Internal server error"
        });
      }

      res.status(201).json({
        message: "Successfully subscribed to newsletter",
        id: docRef.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email format",
          issues: error.issues 
        });
      }
      
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
