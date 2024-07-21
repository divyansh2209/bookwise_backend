const mongoose = require('mongoose');

const { Schema } = mongoose;

const pdfSchema = new Schema({
    title: { type: String },
    raw_text: { type: String },
    chapters:{type: Array}

});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;