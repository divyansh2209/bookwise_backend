const express = require('express');
const {fetchPdfs , extractText, storeChapters, fetchChaptersById, getResult} = require('../controller/Pdf');

const router = express.Router();
//  /orders is already added in base path
router.post('/extract-text', extractText)
    .get('/pdfs', fetchPdfs)
    .post('/:id/chapters', storeChapters)
    .get('/:id/:index' , fetchChaptersById)
    .post('/processed' , getResult)


exports.router = router;