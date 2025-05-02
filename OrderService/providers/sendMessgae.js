const amqp = require("amqplib");

const sendMessage = async (msg) => {
    const conn = await amqp.connect("amqp://localhost");
    console.log("rabbitMQ connected !");
    const ch = await conn.createChannel();
    const queue = "tasks";

    await ch.assertQueue(queue, {durable: false});
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

    console.log("Message Sent");
    setTimeout(() => conn.close(), 500);
}

module.exports = sendMessage;