'use strict';

const { NOTIFICATION } = require('../models/notification.model');

const pushNotificationToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === 'SHOP-001') {
    noti_content = '@@@ just added a product';
  } else if (type === 'PROMOTION-001') {
    noti_content = '@@@ just added new voucher: @@@@@';
  }

  const newNotification = await NOTIFICATION.create({
    noti_type: type,
    noti_content: noti_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options,
  });
  return newNotification;
};

const listNotificationsByUser = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0,
}) => {
  const match = { noti_receivedId: userId };
  if (type !== 'ALL') {
    match['noti_type'] = type;
  }

  return NOTIFICATION.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        // noti_content: {
        //   $concat: [
        //     {
        //       $substr: ['$noti_options.shop_name', 0, -1],
        //     },
        //     'just added new product: ',
        //     {
        //       $substr: ['$noti_options.product_name', 0, -1],
        //     },
        //   ],
        // },
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotificationToSystem,
  listNotificationsByUser,
};
