/* eslint-disable */
import '@babel/polyfill';
import {
  loginUserDetails,
  handleLoginSignUp,
  handleLoginStatusHeader
} from './login';
import { getCurrentTime, validateEmail, removeStopWords } from './utility';
import {
  recognition,
  registerRecognitionStart,
  registerRecognitionEnd,
  registerRecognitionResult
} from './speechHandling';
import axios from 'axios';
import { showAlert } from './alerts';

const async = require('async');

const addUserResponseBubble = ques => {
  const node = document.getElementsByClassName('conversation')[0].children[4];
  const clone = node.cloneNode(true);
  clone.children[0].children[0].innerHTML = ques;
  clone.children[1].children[0].innerHTML = getCurrentTime();
  clone.style.display = 'inherit';
  document.getElementsByClassName('conversation')[0].appendChild(clone);

  document.querySelector('div.message.end[data-type="CAPTION"]').style.display =
    'inherit';
  document.querySelector('.dot-typing').style.display = "block";
  scrollToLatestMessage();
};
const addBotResponseBubble = botResponse => {
  setTimeout(() => {
    const node2 = document.getElementsByClassName('conversation')[0].children[1];
    const clone2 = node2.cloneNode(true);
    clone2.children[0].innerHTML = botResponse;
    clone2.children[1].innerHTML = getCurrentTime();
    document.getElementsByClassName('conversation')[0].appendChild(clone2);
    document.querySelector('.dot-typing').style.display = "none";
    scrollToLatestMessage();
  }, 2500)

};
const addBotResponseQuickReplyBubble = (choices, ques) => {
  setTimeout(() => {
    if (choices.length) {
      const node3 = document.getElementsByClassName('conversation')[0]
        .children[2];
      const clone3 = node3.cloneNode(true);
      clone3.style.display = 'inherit';

      for (let i = 0; i < choices.length; i++) {
        clone3.children[0].children[0].children[i].addEventListener(
          'click',
          e => {
            clone3.remove();
            getReply(`${ques}_${e.target.innerHTML}`);
          }
        );
        clone3.children[0].children[0].children[i].innerHTML = choices[i];
      }

      document.getElementsByClassName('conversation')[0].appendChild(clone3);
      scrollToLatestMessage()
    }
  }, 2500)
};
const scrollToLatestMessage = () => {
  const allMessages = document.getElementsByClassName('conversation')

  allMessages[allMessages.length - 1].lastChild.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
  document.querySelector('#text-inp').value = '';
};
export const getReply = async (ques, orgUserInput) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/conversations/reply?question=${ques.toLowerCase()}`
    });
    // console.log(res.data);

    ques = ques.split('_').reverse()[0];

    if (res.data.status === 'success') {
      if (ques.indexOf('invalid-email') == -1) {
        if (ques.indexOf('valid-email') > -1) {
          ques = loginUserDetails().email;
        }
        if (
          res.data.data.answers[0].indexOf('your email address') > -1 &&
          loginUserDetails().email
        ) {
          res.data.data.answers[0] = 'Let us contact you back on your email id.';
        }

      }
      else {
        ques = orgUserInput
      }
      addUserResponseBubble(ques);

      if (res.data.data.hasOwnProperty('answers')) {
        res.data.data.answers.forEach(addBotResponseBubble)
      }
      else {
        addBotResponseBubble('Not sure how to respond to that! Could you please try again?')
      }

      if (
        res.data.data.hasOwnProperty('choices') &&
        res.data.data.choices.length
      )
        addBotResponseQuickReplyBubble(
          res.data.data.choices,
          res.data.data.questions[0]
        );
    } else {
      addUserResponseBubble(ques);
      if (ques.length < 4) {
        addBotResponseBubble('Not sure how to respond to that! Could you please try again?')
        return
      }

      ques = removeStopWords(ques.toLowerCase());
      let wordsArr = ques.split(' ');
      if (wordsArr.length > 1) {
        async.detect(
          wordsArr,
          // function(value, key, callback) {
          function (value, callback) {
            getCloseReply(value, callback);
          },
          function (err, result) {
            // console.log(err);
            // console.log(result);
            handleCloseReply(result);
          }
        );
      } else {
        handleCloseReply(wordsArr[0]);
      }
    }
  } catch (err) {
    console.log(err.response)
    if(err.response.data.message)
    showAlert('error', err.response.data.message);
  }
};

export const handleCloseReply = async ques => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/conversations/close-reply?question=${ques.toLowerCase()}`
    });

    if (ques && res && res.data.status === 'success') {
      if (
        res.data.data.answers[0].indexOf('your email address') > -1 &&
        sessionStorage &&
        sessionStorage.getItem('user')
      ) {
        res.data.data.answers[0] = 'Let us contact you back on your email id.';
      }
      if (res.data.data.hasOwnProperty('answers')) {
        res.data.data.answers.forEach(addBotResponseBubble)
      }
      else {
        addBotResponseBubble('Not sure how to respond to that! Could you please try again?')
      }

      if (
        res.data.data.hasOwnProperty('choices') &&
        res.data.data.choices.length
      )
        addBotResponseQuickReplyBubble(
          res.data.data.choices,
          res.data.data.questions[0]
        );
    } else {
      addBotResponseBubble(
        'Not sure how to respond to that! Could you please try again?'
      );
    }
  } catch (err) {
    console.log(err)
    if(err.response.data.message)
    showAlert('error', err.response.data.message);
  }
};
export const getCloseReply = async (ques, callback) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/conversations/close-reply?question=${ques.toLowerCase()}`
    });
    if (res.data.data.questions)
      callback(null, 'no error');
    else
      callback('error');

  } catch (err) {
    if(err.response.data.message)
    showAlert('error', err.response.data.message);
  }
};

let handleTextSubmit = userTextInput => {
  document.querySelector(
    'div.message[data-type="BOT_RESPONSE_quickReplies"]'
  ).style = 'display:none';

  if (!userTextInput) return;
  userTextInput.replaceAll(/\p{Emoji}/gu, '').trim();
  userTextInput = userTextInput.split(' ').reduce(
    (previousValue, currentValue) => {
      if (currentValue) {
        previousValue = previousValue.concat(currentValue);
      }
      return previousValue;
    },
    [],
  ).join(' ')

  if (
    document
      .querySelector('.conversation')
      .lastChild.children[0].innerHTML.indexOf('email address') > -1
  ) {
    if (validateEmail(userTextInput)) {
      if (sessionStorage)
        sessionStorage.setItem(
          'user',
          JSON.stringify({ email: userTextInput })
        );
      getReply('valid-email');
    } else {
      getReply('invalid-email', userTextInput);
    }
  } else {
    getReply(userTextInput.toLowerCase());
  }
};

let handleChatContainer = () => {
  const textInput = document.querySelector('#text-inp');
  const micIcon = document.querySelector('#mic-icon');
  const sendIcon = document.querySelector('#send-icon');
  const quickReplyOne = document.querySelector('#one');
  const quickReplyTwo = document.querySelector('#two');
  const botChatIcon = document.querySelector('#botChatIcon');

  document.querySelector('div.message.end[data-type="CAPTION"]').style =
    'display:none';
  document.querySelector(
    'div.message.end[data-type="INPUT_BUTTON_GOTO"]'
  ).style = 'display:none';

  quickReplyOne &&
    quickReplyOne.addEventListener('click', e => {
      getReply(e.target.innerHTML.replaceAll(/\p{Emoji}/gu, '').trim());
      e.target.parentElement.parentElement.parentElement.parentElement.style.display =
        'none';
    });
  quickReplyTwo &&
    quickReplyTwo.addEventListener('click', e => {
      getReply(e.target.innerHTML.replaceAll(/\p{Emoji}/gu, '').trim());
      e.target.parentElement.parentElement.parentElement.parentElement.style.display =
        'none';
    });

  botChatIcon &&
    botChatIcon.addEventListener('click', e => {
      const chatIcon = document.querySelector('.icon--chat');
      const closeIcon = document.querySelector('.icon--close');
      if (closeIcon.style.display == "none" || closeIcon.style.display == "") {
        setTimeout(() => {

          closeIcon.style.display = "block";
          chatIcon.style.display = "none";
        }, 200)
      } else {
        setTimeout(() => {
          chatIcon.style.display = "inline";
          closeIcon.style.display = "none";

        }, 200)
      }

      setTimeout(() => {
        micIcon.addEventListener('click', e => {
          recognition.start();
        });

        sendIcon.addEventListener('click', e => {
          let userTextInput = document.querySelector('#text-inp').value;

          handleTextSubmit(userTextInput);
        });

        textInput.addEventListener('focus', e => {
          sendIcon.children[0].children[0].style.fill = '#0066FF';
          textInput.style.color = 'rgb(0,0,0)';
        });

        textInput.addEventListener('blur', e => {
          sendIcon.children[0].children[0].style.fill = '#d7d7d7';
          textInput.style.color = 'rgb(150,155,166)';
        });

        textInput.addEventListener('keypress', function (event) {
          if (event.target.value.trim() && event.key === 'Enter') {
            sendIcon.click();
          }
        });
      }, 0);
    });
};

if (location.pathname == '/') {
  (() => {
    registerRecognitionStart();
    registerRecognitionEnd();
    registerRecognitionResult(function (val) {
      handleTextSubmit(val)
    });
  })();
  handleChatContainer();
} else {
  handleLoginSignUp();
}
handleLoginStatusHeader();
