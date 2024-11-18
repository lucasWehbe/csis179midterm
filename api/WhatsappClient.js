const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Initialize the WhatsApp client with LocalAuth for automatic session management
const client = new Client({
    authStrategy: new LocalAuth()  // Use LocalAuth for session management
});

client.on('qr', (qr) => {
    console.log('Scan this QR code with your phone to log in to WhatsApp:');
    qrcode.generate(qr, { small: true });
});

const sendMessageToNumber = async (number, message) => {
    try {
        // Format the number to include WhatsApp's country code structure, e.g., "1234567890" becomes "1234567890@c.us"
        const chatId = `961${number}@c.us`;

        await client.sendMessage(chatId, message);

        console.log(`Message sent to ${number}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Example usage: Send a message to a specific number
client.on('ready', () => {
    console.log('WhatsApp client is ready');

});



client.on('authenticated', () => {
    console.log('Authenticated successfully');
});

client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
});

client.initialize();

module.exports = { client, sendMessageToNumber };