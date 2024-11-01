const cron= require('node-cron');
import axios from "axios"

const countAndUpdate = cron.schedule('* * * * *', () => {
  console.log('running a task every hour');
  
});

const startOfCron = () => {}
  
  //countAndUpdate.start()

module.exports = {startOfCron}