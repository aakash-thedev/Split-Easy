"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = require("mongoose");
const groupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    coverImageUrl: { type: String },
    categories: [{ type: String }],
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});
exports.Group = (0, mongoose_1.model)('Group', groupSchema);
