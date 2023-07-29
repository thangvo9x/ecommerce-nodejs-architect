'use strict';

const { SuccessResponse, OkSuccess } = require('../core/success.response');
const commentService = require('../services/comment.service');

class CommentController {
  addComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create comment Success!',
      metadata: await commentService.createComment(req.body),
    }).send(res);
  };

  getComments = async (req, res, next) => {
    new OkSuccess({
      message: 'Get List comments Success!',
      metadata: await commentService.getListComment(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new OkSuccess({
      message: 'Deleted comment Success!',
      metadata: await commentService.deleteComment(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
