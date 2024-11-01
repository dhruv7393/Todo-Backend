const express = require('express')
const router = express.Router()
const {getDailyTask, updateDailyTask, setPendingTask} = require('../controllers/dailyTaskController')

router.get('/', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    getDailyTask(req, res)
})

router.patch('/:id', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    updateDailyTask(req, res)
})

router.get('/updatecount', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    setPendingTask(req, res)
})

module.exports = router