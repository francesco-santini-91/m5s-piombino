var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController');


router.get('/', postsController.getPostsList);

router.get('/numberOfPosts', postsController.getNumberOfTotalPosts);

router.get('/:urlTitle', postsController.getPostDetail);

router.post('/newPost', postsController.createPost);

router.put('/:urlTitle', postsController.editPost);

router.post('/:urlTitle/verifyLike', postsController.verifyLikeToPost);

router.post('/:urlTitle/like', postsController.likeToPost);

router.post('/:urlTitle/comment', postsController.commentToPost);

router.post('/:urlTitle/:commentID/verifyLike', postsController.verifyLikeToComment)

router.post('/:urlTitle/:commentID/like', postsController.likeToComment);

router.put('/:urlTitle/:commentID', postsController.editComment);

router.patch('/:urlTitle/:commentID', postsController.deleteComment);

router.patch('/:urlTitle', postsController.deletePost);

module.exports = router;