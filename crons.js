const cron= require('node-cron');

const countAndUpdate = cron.schedule('0 * * * *', () => {
    console.log('running a task every one hour');

    fetch("https://main.d3blcxzr0t6m0f.amplifyapp.com/api/tasks", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Android\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "Referer": "https://main.d1mncb3ffwt3qn.amplifyapp.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"title\":\"test\",\"notes\":[\"test\"],\"imp\":1,\"done\":false,\"pinned\":false}",
        "method": "POST"
      });
});

const startOfCron = () => countAndUpdate.start()

module.exports = {startOfCron}