const express = require('express')
const router = express.Router()
const {getVaccation, updateVaccation} = require('../controllers/vaccationController')

router.get('/', (req, res)=>{
    getVaccation(req, res)
})

router.patch('/:id', (req, res)=>{
    updateVaccation(req, res)
})

module.exports = router