"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_service_account_json_1 = __importDefault(require("./firebase-service-account.json"));
let app;
if (!(0, app_1.getApps)().length) {
    app = (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(firebase_service_account_json_1.default),
    });
}
else {
    app = (0, app_1.getApps)()[0];
}
exports.db = (0, firestore_1.getFirestore)(app);
