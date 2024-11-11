const express = require('express')
const router = express.Router()
// const {getHeaders, postHeaders, getHeadersById,updateHeadersById, deleteHeadersById} = require('../controllers/todoHeadersController')

router.get('/', (req, res)=>{
    res.send(`This is test route`);
})

module.exports = router