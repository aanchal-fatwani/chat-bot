const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const textInput = document.querySelector('#text-inp');

const registerRecognitionStart = () => {
  recognition.onstart = function () {
    textInput.placeholder = "Listening.."
    console.log('We are listening. Try speaking into the microphone..');
    setTimeout(() => {
      registerRecognitionEnd()
    }, 5000)
  };
};

const registerRecognitionEnd = () => {
  textInput.placeholder = "Type your message here.."
  recognition.onspeechend = function () {
    console.log('Stopped listening.');
    recognition.stop();
  };
};

const registerRecognitionResult = callbackFn => {
  recognition.onresult = function (event) {
    const { transcript, confidence } = event.results[0][0];

    console.log(transcript);
    console.log(confidence);
    callbackFn(transcript);
  };
};

module.exports = {
  recognition,
  registerRecognitionStart,
  registerRecognitionEnd,
  registerRecognitionResult
};
