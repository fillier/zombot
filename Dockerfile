FROM node:latest

LABEL org.opencontainers.image.description DESCRIPTION
LABEL org.opencontainers.image.version v1.0.0

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY src /usr/src/bot/src

# Start the bot.
CMD ["node", "src/index.js"]
