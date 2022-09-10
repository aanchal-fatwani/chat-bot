const fs = require('fs');
const PDFDocument = require('pdfkit');
const Conversation = require('../models/conversationModel');

exports.knowledgeBase = async (req, res) => {
  try {
    let coversations = await Conversation.find();
    coversations = coversations.filter(
      el => el.questions[0].indexOf('_') < 0 && el.questions[0].indexOf('-') < 0
    );
    coversations = coversations.map(el => {
      return { user: el.questions, bot: el.answers };
    });

    const doc = new PDFDocument();
    const filename = `knowledge-base.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    res.status(201);

    const capitalizeFirstLetter = string =>
      string.charAt(0).toUpperCase() + string.slice(1);

    coversations.forEach(element => {
      doc.text(`${capitalizeFirstLetter(element.user.join(' '))}      :You`, {
        width: 410,
        align: 'right'
      });
      doc.moveDown();
      doc.text(`Bot:       ${capitalizeFirstLetter(element.bot.join(' '))}`, {
        width: 410,
        align: 'left'
      });
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
    });

    doc.pipe(fs.createWriteStream(filename, { flags: 'w' }));
    doc.pipe(res);
    doc.end();
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch data' });
  }
};
