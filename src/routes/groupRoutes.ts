import { Router } from "express";
import { addUserInGroup, fetchUserGroups, createGroup, groupDetails, removeUserFromGroup } from "../controllers/groupController";
import { protect } from "../middlewares/auth";

const router = Router();

// @route     POST /api/groups/create
// @desc      Create a new group
// @access    PRIVATE
router.post('/create', protect, createGroup);

// @route     GET /api/groups/fetchUserGroups
// @desc      Fetch User Groups
// @access    PRIVATE
router.get('/fetchUserGroups', protect, fetchUserGroups);

// @route     GET /api/groups/:id/details
// @desc      Get group details
// @access    PRIVATE
router.get('/:id/details', protect, groupDetails);

// @route     POST /api/groups/:id/addUser
// @desc      add a new user to group
// @access    PRIVATE
router.post('/:id/addUser', protect, addUserInGroup);

// @route     DELETE /api/groups/:id/removeUser
// @desc      remove a user from group
// @access    PRIVATE
router.delete('/:id/removeUser', protect, removeUserFromGroup);

export default router;