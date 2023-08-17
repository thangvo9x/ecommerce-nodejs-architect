'use strict';

const { SuccessResponse, OkSuccess } = require('../core/success.response');
const notificaitonService = require('../services/notification.service');

class NotificationController {
  getNotifications = async (req, res, next) => {
    new OkSuccess({
      message: 'Get List notifications Success!',
      metadata: await notificaitonService.listNotificationsByUser(req.body),
    }).send(res);
  };
}

module.exports = new NotificationController();
