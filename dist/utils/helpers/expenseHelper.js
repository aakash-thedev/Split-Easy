"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAnalysisResult = parseAnalysisResult;
exports.isInvalidReceipt = isInvalidReceipt;
function parseAnalysisResult(analysis) {
    // Implement a simple parsing logic or use regex to extract the required fields
    const descriptionMatch = analysis.match(/description:\s*(.*)/i);
    const totalAmountMatch = analysis.match(/total_amount:\s*(.*)/i);
    const expenseTypeMatch = analysis.match(/expense_type:\s*(.*)/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : 'Unknown';
    const totalAmount = totalAmountMatch ? totalAmountMatch[1].trim() : '0';
    const expenseType = expenseTypeMatch ? expenseTypeMatch[1].trim() : 'Unknown';
    return [description, totalAmount, expenseType];
}
// Helper function to check if the image is not a valid receipt or bill
function isInvalidReceipt(analysis) {
    // This logic depends on the format of the AI's response.
    // Example: Check if the response contains a phrase indicating invalidity
    return analysis.toLowerCase().includes('not a valid bill or receipt');
}
