FROM node:latest

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY src /usr/src/bot/src

# Start the bot.
CMD ["node", "src/index.js"]
