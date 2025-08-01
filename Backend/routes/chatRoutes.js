const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    addToGroup,
    removeFromGroup
} = require("../controllers/chatController");

const router = express.Router();

router.route('/')
    .post(protect, accessChat)
    .get(protect, fetchChats);

router.route('/group')
    .post(protect, createGroupChat);

router.route('/groupadd')
    .put(protect, addToGroup);

router.route('/groupremove')
    .put(protect, removeFromGroup);

module.exports = router;
