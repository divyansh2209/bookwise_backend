const express = require('express');
const {fetchPdfs , extractText, storeChapters} = require('../controller/Pdf');

const router = express.Router();
//  /orders is already added in base path
router.post('/extract-text', extractText)
    .get('/pdfs', fetchPdfs)
    .post('/:id/chapters', storeChapters);


exports.router = router;