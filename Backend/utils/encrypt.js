const crypto = require("crypto");

const SECRET_KEY = process.env.MSG_SECRET_KEY;

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    throw new Error("❌ MSG_SECRET_KEY must be a 32-byte string in the .env file.");
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);

    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(encryptedText) {
    try {
        const [ivHex, encryptedData] = encryptedText.split(":");
        if (!ivHex || !encryptedData) throw new Error("Invalid encrypted format.");

        const iv = Buffer.from(ivHex, "hex");
        const encryptedBuffer = Buffer.from(encryptedData, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);

        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString("utf8");
    } catch (err) {
        console.error("Decryption error:", err.message);
        return null;
    }
}

module.exports = { encrypt, decrypt };
