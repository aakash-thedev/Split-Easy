"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSettlementResult = void 0;
const mongoose_1 = require("mongoose");
const groupSettlementResult = new mongoose_1.Schema({
    result: { type: String, required: true },
    group: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group' }
}, {
    timestamps: true
});
exports.GroupSettlementResult = (0, mongoose_1.model)('GroupSettlementResult', groupSettlementResult);
