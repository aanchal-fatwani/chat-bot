const express = require('express');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router.route('/reply').get(conversationController.reply);
router.route('/close-reply').get(conversationController.closeReply);

router
  .route('/')
  .get(conversationController.getAllQuestions)
  .post(conversationController.addQuestion);

router
  .route('/:id')
  .get(conversationController.getQuestion)
  .patch(conversationController.updateQuestion)
  .delete(conversationController.deleteQuestion);

module.exports = router;
