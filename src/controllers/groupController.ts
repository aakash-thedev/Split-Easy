import { Request, Response } from "express";
import { Group } from "../models/Group";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth";
import { Expense } from "../models/Expense";

// @route     POST /api/groups/create
// @desc      Create a new group
// @access    PRIVATE
export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupName, groupDescription, memberIds, categories } = req.body;
    const group = new Group({ name: groupName, description: groupDescription, members: [...memberIds, req.user.id], categories });
    await group.save();

    res.status(201).json({ group });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     GET /api/groups/fetchUserGroups
// @desc      Fetch User Groups
// @access    PRIVATE
export const fetchUserGroups = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ members: userId }).populate('members', 'id, name').sort({ createdAt: -1 });

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     GET /api/groups/:id/details
// @desc      Get group details
// @access    PRIVATE
export const groupDetails = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ group: group.id })
      .populate('paidBy', 'id, name')
      .populate('splitBetween', 'id, name')
      .sort({ createdAt: -1 })

    res.status(200).json({ group: group, expenses: expenses });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     POST /api/groups/:id/addUser
// @desc      add a new user to group
// @access    PRIVATE
export const addUserInGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    group.members.push(user.id);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     DELETE /api/groups/:id/removeUser
// @desc      remove a user from group
// @access    PRIVATE
export const removeUserFromGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter(member => member.toString() !== req.body.userId);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
