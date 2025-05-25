const mongoose = require('mongoose');

const InscriptionSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    phone : { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    motivation : { type: String, required: false }
});

const Inscription = mongoose.model('Inscription', InscriptionSchema);

module.exports = Inscription;
