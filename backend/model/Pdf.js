const mongoose = require('mongoose');
const { Schema } = mongoose;

const pdfSchema = new Schema({
    title: { type: String },
    chapters: { type: Array },
    chapters_summary: { type: Array },
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;
