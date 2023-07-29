'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const CommentController = require('../../controllers/comment.controller');

// authentication
router.use(authentication);

router.post('', asyncHandler(CommentController.addComment));
router.get('', asyncHandler(CommentController.getComments));
router.delete('', asyncHandler(CommentController.deleteComment));

module.exports = router;
