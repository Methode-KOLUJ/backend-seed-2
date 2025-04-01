const mongoose = require('mongoose');

const InscriptionSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    codePays: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    message: { type: String, required: true }
});

const Inscription = mongoose.model('Inscription', InscriptionSchema);

module.exports = Inscription;
