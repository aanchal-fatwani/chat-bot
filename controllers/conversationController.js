const Conversation = require('../models/conversationModel');

const catchHandler = require('../utils/catchHandler');
const factory = require('./handlerFactory');

exports.getAllQuestions = factory.getAll(Conversation);
exports.addQuestion = factory.createOne(Conversation);

exports.getQuestion = factory.getOne(Conversation);
exports.updateQuestion = factory.updateOne(Conversation);
exports.deleteQuestion = factory.deleteOne(Conversation);

exports.reply = catchHandler(async (req, res, next) => {
  const coversations = await Conversation.find({
    questions: req.query.question
  });
  // console.log(coversations);

  res.status(200).json({
    data: coversations.length ? coversations[0] : {},
    status: coversations.length ? 'success' : 'fail'
  });
});

exports.closeReply = catchHandler(async (req, res, next) => {
  const queriedQuestion = req.query.question;
  // console.log(queriedQuestion);
  let conversations;
  if (queriedQuestion.split(' ').length === 1)
    conversations = await Conversation.find({
      questions: req.query.question
    })
  if (!conversations.length)
    conversations = await Conversation.find({
      questions: { $regex: ` ${queriedQuestion}`, $options: 'i' }
    });
  // console.log(conversations);

  res.status(200).json({
    data: conversations.length ? conversations[0] : {},
    status: conversations.length ? 'success' : 'fail'
  });
});
