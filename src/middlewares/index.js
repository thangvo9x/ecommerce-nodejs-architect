'use strict';

const Logger = require('../loggers/discord.log.v2');

const pushToLogDiscord = async (req, res, next) => {
  try {
    Logger.sendToMessage(req.get('body'));
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};
