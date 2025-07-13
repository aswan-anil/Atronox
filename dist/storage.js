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
exports.storage = exports.MemStorage = void 0;
class MemStorage {
    constructor() {
        this.newsletters = new Map();
        this.emailToId = new Map();
        this.currentId = 1;
    }
    createNewsletterSubscription(insertNewsletter) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists
            const existingId = this.emailToId.get(insertNewsletter.email);
            if (existingId) {
                const existing = this.newsletters.get(existingId);
                if (existing) {
                    throw new Error("Email already subscribed");
                }
            }
            const id = this.currentId++;
            const newsletter = Object.assign(Object.assign({}, insertNewsletter), { id, createdAt: new Date().toISOString() });
            this.newsletters.set(id, newsletter);
            this.emailToId.set(insertNewsletter.email, id);
            return newsletter;
        });
    }
    getNewsletterByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.emailToId.get(email);
            if (!id)
                return undefined;
            return this.newsletters.get(id);
        });
    }
}
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
