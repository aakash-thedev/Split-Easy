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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromGroup = exports.addUserInGroup = exports.groupDetails = exports.fetchUserGroups = exports.createGroup = void 0;
const Group_1 = require("../models/Group");
const User_1 = __importDefault(require("../models/User"));
const Expense_1 = require("../models/Expense");
const GroupSettlementResult_1 = require("../models/GroupSettlementResult");
// @route     POST /api/groups/create
// @desc      Create a new group
// @access    PRIVATE
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName, groupDescription, memberIds, categories } = req.body;
        const group = new Group_1.Group({ name: groupName, description: groupDescription, members: [...memberIds, req.user.id], categories });
        yield group.save();
        res.status(201).json({ group });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.createGroup = createGroup;
// @route     GET /api/groups/fetchUserGroups
// @desc      Fetch User Groups
// @access    PRIVATE
const fetchUserGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const groups = yield Group_1.Group.find({ members: userId }).populate('members', 'id, name').sort({ createdAt: -1 });
        res.status(200).json({ groups });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.fetchUserGroups = fetchUserGroups;
// @route     GET /api/groups/:id/details
// @desc      Get group details
// @access    PRIVATE
const groupDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield Group_1.Group.findById(req.params.id).populate('members', 'name email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const expenses = yield Expense_1.Expense.find({ group: group.id })
            .populate('paidBy', 'id, name')
            .populate('splitBetween', 'id, name')
            .sort({ createdAt: -1 });
        const groupResult = yield GroupSettlementResult_1.GroupSettlementResult.findOne({ group: group._id });
        res.status(200).json({ group: group, expenses: expenses, groupResult: groupResult ? groupResult.result : null });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.groupDetails = groupDetails;
// @route     POST /api/groups/:id/addUser
// @desc      add a new user to group
// @access    PRIVATE
const addUserInGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield Group_1.Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const user = yield User_1.default.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        group.members.push(user.id);
        yield group.save();
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.addUserInGroup = addUserInGroup;
// @route     DELETE /api/groups/:id/removeUser
// @desc      remove a user from group
// @access    PRIVATE
const removeUserFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield Group_1.Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.members = group.members.filter(member => member.toString() !== req.body.userId);
        yield group.save();
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.removeUserFromGroup = removeUserFromGroup;
