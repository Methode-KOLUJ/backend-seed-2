const express = require('express');
const router = express.Router();
const Inscription = require('../models/Inscription');

// Route pour enregistrer les inscriptions
router.post('/', async (req, res) => {
    try {
        const { nom, telephone, codePays, email, role, message } = req.body;

        // Création d'une nouvelle inscription
        const nouvelleInscription = new Inscription({
            nom,
            telephone,
            codePays,
            email,
            role,
            message
        });

        await nouvelleInscription.save();
        res.status(201).json({ message: "Inscription réussie !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
});

module.exports = router;
