const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "UserId not provided" });
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    });

    if (isChat.length > 0) {
        return res.send(isChat[0]);
    }

    try {
        const createdChat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        });

        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );

        return res.status(200).send(fullChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email",
        });

        res.status(200).send(chats);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ message: "At least 2 users are required to create a group" });
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    res.json(updatedChat);
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    res.json(updatedChat);
});

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    addToGroup,
    removeFromGroup,
};
