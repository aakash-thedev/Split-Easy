import { Router } from "express";
import { addUserInGroup, createGroup, groupDetails, removeUserFromGroup } from "../controllers/groupController";

const router = Router();

// @route     POST /api/groups/create
// @desc      Create a new group
// @access    PRIVATE
router.post('/create', createGroup);

// @route     GET /api/groups/:id/details
// @desc      Get group details
// @access    PRIVATE
router.get('/:id/details', groupDetails);

// @route     POST /api/groups/:id/addUser
// @desc      add a new user to group
// @access    PRIVATE
router.post('/:id/addUser', addUserInGroup);

// @route     DELETE /api/groups/:id/removeUser
// @desc      remove a user from group
// @access    PRIVATE
router.delete('/:id/removeUser', removeUserFromGroup);

export default router;