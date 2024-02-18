// Import the necessary classes from discord.js library and the dotenv package
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import process from 'process';
import { spawn } from 'child_process';

process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})

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
    message.reply("Available commands are: ping, online, restart");
  }

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  if (command === "online") {
    getPlayers(message)
  }

  if (command === "restart") {
    restartServer()
    message.reply(`Server restarted...this will take some time.`);
  }
});

function getPlayers(message) {
  var response = '';
  const child = spawn('rconclt', ['zomboid', 'players']);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    response += data;
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    message.reply(response);
  });
}

function restartServer() {
  const child = spawn('docker', ['restart', 'zomboid-server']);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

// Log in the bot with the token from the environment variables and handle potential login errors
client.login(process.env.TOKEN).catch((err) => {
  console.log(`Error logging in: ${err}`);
});
