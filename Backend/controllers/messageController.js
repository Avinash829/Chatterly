const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { encrypt, decrypt } = require("../utils/encrypt");

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: "Content and chatId are required." });
    }

    const newMessage = {
        sender: req.user._id,
        content: encrypt(content),
        chat: chatId,
        isEncrypted: true,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        message.content = decrypt(message.content);
        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error("Failed to send message: " + error.message);
    }
});

const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat");

        const decryptedMessages = messages.map((msg) => ({
            ...msg.toObject(),
            content: msg.isEncrypted ? decrypt(msg.content) : msg.content,
        }));

        res.status(200).json(decryptedMessages);
    } catch (error) {
        res.status(400);
        throw new Error("Failed to fetch messages: " + error.message);
    }
});

module.exports = { sendMessage, allMessages };
