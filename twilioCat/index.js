const twilio = require('twilio');
const fetch = require('node-fetch');

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

    getCat()
    .then((imgUrl) => sendTwilioMessage(imgUrl))
    .then(() => context.done())
    .catch((reason) => {
      context.log(reason.message);
      context.done();
    });

  context.res = {
      status: 200,
      body: "thanks, I sent you a cat!" 
  };
};

const getCat = () => {
  // <a href="thecatapi.com/hfjdhfjh"><img src="http://tumblr.com/hdsjhfj"/></a>
  return fetch(`http://thecatapi.com/api/images/get?api_key=${process.env.CatApiToken}&format=html`)
    .then((response) => response.text())
    .then((response) => new RegExp('src="(.+?)"').exec(response)[1]);
};

const sendTwilioMessage = (imageUrl) => {
  // Twilio Credentials
  const accountSid = process.env.TwilioAccountSid;
  const authToken = process.env.TwilioAuthToken;

  // require the Twilio module and create a REST client
  const client = twilio(accountSid, authToken);

  return client
    .messages
    .create({
      to: process.env.TwilioToNumber,
      from: process.env.TwilioFromNumber,
      body: 'Here is a lovely cat!',
      mediaUrl: imageUrl,
    })
};
