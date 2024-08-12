"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupController_1 = require("../controllers/groupController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// @route     POST /api/groups/create
// @desc      Create a new group
// @access    PRIVATE
router.post('/create', auth_1.protect, groupController_1.createGroup);
// @route     GET /api/groups/fetchUserGroups
// @desc      Fetch User Groups
// @access    PRIVATE
router.get('/fetchUserGroups', auth_1.protect, groupController_1.fetchUserGroups);
// @route     GET /api/groups/:id/details
// @desc      Get group details
// @access    PRIVATE
router.get('/:id/details', auth_1.protect, groupController_1.groupDetails);
// @route     POST /api/groups/:id/addUser
// @desc      add a new user to group
// @access    PRIVATE
router.post('/:id/addUser', auth_1.protect, groupController_1.addUserInGroup);
// @route     DELETE /api/groups/:id/removeUser
// @desc      remove a user from group
// @access    PRIVATE
router.delete('/:id/removeUser', auth_1.protect, groupController_1.removeUserFromGroup);
exports.default = router;
