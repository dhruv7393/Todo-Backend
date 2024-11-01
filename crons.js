const cron= require('node-cron');

const countAndUpdate = cron.schedule('* * * * *', () => {
  console.log('running a task every hour');
  fetch("https://main.d3blcxzr0t6m0f.amplifyapp.com/api/tasks", {
    "headers": {
      "content-type": "application/json",
      'Access-Control-Allow-Origin' : '*'
    },
    "body": "{\"title\":\"Test\",\"notes\":[\"Test\"],\"imp\":1,\"done\":false,\"pinned\":false}",
    "method": "POST"
  });
});

const startOfCron = () => countAndUpdate.start()

module.exports = {startOfCron}