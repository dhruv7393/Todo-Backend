const express = require('express')
const router = express.Router()
const {getTasks, postTask, getTasksById, updateTask, deleteTask} = require('../controllers/todoController')

router.get('/', (req, res)=>{
    getTasks(req, res)
})

router.get('/:id', (req, res)=>[
    getTasksById(req, res)
])

router.post('/', (req, res)=>{
    postTask(req, res)
})

router.patch('/:id', (req, res)=>[
    updateTask(req, res)
])

router.delete('/:id', (req, res)=>[
    deleteTask(req, res)
])

module.exports = router