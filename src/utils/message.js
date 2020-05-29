const generateMessage = (msg) => {
  return {
    text: msg,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime()
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage
};
