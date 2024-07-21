const mongoose = require('mongoose');
const { Schema } = mongoose;

const pdfSchema = new Schema({
    title: { type: String },
    chapters: { type: Array },
    processed_data: { 
        type: [Schema.Types.Mixed], // An array of objects
        default: [] 
    },
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;
