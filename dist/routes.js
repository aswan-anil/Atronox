"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const schema_1 = require("./schema");
const zod_1 = require("zod");
const firebase_admin_1 = require("./firebase-admin");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Newsletter subscription endpoint
        app.post("/api/newsletter/subscribe", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = schema_1.insertNewsletterSchema.parse(req.body);
                // Check if email already exists in Firestore
                const existingQuery = yield firebase_admin_1.db.collection("newsletter_subscriptions")
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
                    docRef = yield firebase_admin_1.db.collection("newsletter_subscriptions").add({
                        email: validatedData.email,
                        createdAt: new Date().toISOString(),
                    });
                }
                catch (firestoreError) {
                    console.error("Failed to write to Firestore:", firestoreError);
                    return res.status(500).json({
                        message: "Internal server error"
                    });
                }
                res.status(201).json({
                    message: "Successfully subscribed to newsletter",
                    id: docRef.id
                });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({
                        message: "Invalid email format",
                        issues: error.issues
                    });
                }
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        }));
        const httpServer = (0, http_1.createServer)(app);
        return httpServer;
    });
}
