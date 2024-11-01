const cron= require('node-cron');

const countAndUpdate = cron.schedule('* * * * *', () => {
  console.log('running a task every hour');
  fetch("/api/tasks", {
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