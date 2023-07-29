'use strict';
const { NotFoundError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { convertToObjectId } = require('../utils');
const { findProduct } = require('./product.service.xxx');

/* 
key features: Comment Service

+ add comment : [User, Shop]
+ get a list of comments [User, Shop]
+ delete a comment [User, Shop, Admin]

*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('parent comment not found');

      rightValue = parentComment.comment_right;
      // updateMany comments
      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
      );
      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_left: { $gte: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectId(productId),
        },
        'comment_right',
        { sort: { comment_right: -1 } },
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    console.log('rightValue', rightValue);
    // insert
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getListComment({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError(' not found parent comment');

      const comments = await Comment.find({
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 });
      return comments;
    }
    const comments = await Comment.find({
      comment_productId: convertToObjectId(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });
    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    // check product exist in db
    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct) throw new NotFoundError('product not found');

    // 1. tim left and right trong comment
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. tinh width
    const width = rightValue - leftValue + 1; // formula to calculate

    // 3. delete comment
    await Comment.deleteMany({
      comment_productId: convertToObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    // 4. update gia tri lai left and right
    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      },
    );
    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      },
    );
  }
}

module.exports = CommentService;
