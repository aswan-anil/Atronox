"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNewsletterSchema = void 0;
const zod_1 = require("zod");
exports.insertNewsletterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
