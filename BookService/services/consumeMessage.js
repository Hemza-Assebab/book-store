const amqp = require("amqplib");
const Book = require("../models/book");

const consumeMessage = async () => {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const queue = "tasks";

    await ch.assertQueue(queue, {durable: false});
    console.log("Waiting for messages...");
    ch.consume(queue, async (msg) => {
        const {bookId} = JSON.parse(msg.content);
        const bookUpdated = await Book.updateOne({_id: bookId}, {$inc : {bought: 1}});
        console.log("Book Updated !");
        
        ch.ack(msg);
    });
}

module.exports = consumeMessage;