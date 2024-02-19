// Import the necessary classes from discord.js library and the dotenv package
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import Rcon from 'rcon';

// Configure dotenv to load the environment variables from the .env file
dotenv.config();

// Create a new client instance and configure intents and partials for the bot's functionality 
const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions,
 ],
 partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Message prefix
const prefix = "!";

// Set up an event listener to log when the bot is ready and operational
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})


client.on("messageCreate", message => {
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "help") {
    console.log("command: help");
    message.reply("Available commands are: ping, online, restart");
  }

  if (command === "ping") {
    console.log("command: ping");
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  if (command === "online") {
    console.log("command: online");
    rcon("players", message);
  }

  if (command === "restart") {
    console.log("command: restart");
    rcon("quit", null);
    message.reply(`Restarting server...this will take some time.`);
  }
});

function rcon(command, message) {
  const conn = new Rcon(process.env.RCON_HOST, process.env.RCON_PORT, process.env.RCON_PASSWORD);
  conn.on('auth', () => {
    // You must wait until this event is fired before sending any commands,
    // otherwise those commands will fail.
    console.log("Authenticated");
    console.log(`Sending RCON command: ${command}`);
    conn.send(command);
  });
  conn.on('response', (str) => {
    if(str.length > 0) {
      console.log("Response: " + str);
      if(message) message.reply(str);
      conn.disconnect();
    }
  });
  conn.on('error', (err) => {
    console.log("Error: " + err);
  });
  conn.on('end', () => {
    console.log("Connection closed");
  });

  conn.connect();
}

// Log in the bot with the token from the environment variables and handle potential login errors
client.login(process.env.TOKEN).catch((err) => {
  console.log(`Error logging in: ${err}`);
});
