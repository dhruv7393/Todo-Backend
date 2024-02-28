const express = require('express')
const router = express.Router()
const {getDailyTask, updateDailyTask, setPendingTask} = require('../controllers/dailyTaskController')

router.get('/', (req, res)=>{
    getDailyTask(req, res)
})

router.patch('/:id', (req, res)=>[
    updateDailyTask(req, res)
])

router.get('/updatecount', (req, res)=>{
    setPendingTask(req, res)
})

module.exports = router