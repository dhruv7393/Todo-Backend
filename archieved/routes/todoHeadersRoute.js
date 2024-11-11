const express = require('express')
const router = express.Router()
const {getHeaders, postHeaders, getHeadersById,updateHeadersById, deleteHeadersById} = require('../controllers/todoHeadersController')

router.get('/', (req, res)=>{
    getHeaders(req, res)
})

router.post('/', (req, res)=>{
    postHeaders(req, res)
})

router.get('/:id', (req, res)=>[
    getHeadersById(req, res)
])

router.patch('/:id', (req, res)=>[
    updateHeadersById(req, res)
])

router.delete('/:id', (req, res)=>[
    deleteHeadersById(req, res)
])

module.exports = router