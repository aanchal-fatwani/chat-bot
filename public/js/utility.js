const getCurrentTime = () => {
  const time = new Date();
  return time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const removeStopWords = val => {
  let str = val.replace(/[^a-zA-Z0-9 ]/g, '');
  const stopWords = ['to', 'i', 'you', 'want', 'have', 'few', 'tell', 'me', 'a', 'what', 'is', 'your', 'just', 'with', 'of'];
  str = str.split(' ').filter(el => {
    return el && !stopWords.includes(el);
  });
  return str.join(' ');
};

module.exports = {
  getCurrentTime,
  validateEmail,
  removeStopWords
};


// fetch('http://127.0.0.1:3000/api/v1/conversations/62fbfc62b40473541c83a6f1', {
//   method: 'DELETE',
// })
// .then(res => res.text()) // or res.json()
// .then(res => console.log(res))


// function createNew(conv) {
//   // const formData = new FormData();
//   // formData.append('questions', conv.questions);
//   // formData.append('answers', conv.answers);
//   // formData.append('choices', conv.choices);
//   // console.log(conv);
//   // console.log(formData)
//   return fetch('http://127.0.0.1:3000/api/v1/conversations', {
//       method: 'POST',
//       body: JSON.stringify(conv),
//       headers: {
//       "Content-Type": "application/json"
//         }
//   }).then(response => response.json())
// }
// let conv = {
//   questions:["i want to connect with you"],
//   answers:["Sure.. Let us start with your email address to connect back with you"],
//   choices:[]
// }

// createNew(conv)
//  .then((json) => {
//      console.log(json)
//   })
//  .catch(error => error);
