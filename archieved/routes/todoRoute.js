const express = require('express')
const router = express.Router()
const {getToDos, postToDo, getToDosById, updateTodo, deleteTodo} = require('../controllers/todoController')

router.get('/', (req, res)=>{
    getToDos(req, res)
})

router.post('/', (req, res)=>{
    postToDo(req, res)
})

router.get('/:id', (req, res)=>[
    getToDosById(req, res)
])

router.patch('/:id', (req, res)=>[
    updateTodo(req, res)
])

router.delete('/:id', (req, res)=>[
    deleteTodo(req, res)
])

module.exports = router