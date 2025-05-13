const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chatRoutes = require("./routes/chat");
const partnerRoutes = require("./routes/Partenaire");
const inscriptionRoutes = require("./routes/Inscription");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        /^https:\/\/(www\.)?ong-seed\.com$/,
        /^https:\/\/(www\.)?ong-seed\.vercel\.app$/
      ];
      if (!origin || allowedOrigins.some(o => o.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/chat", chatRoutes);

// Connexion à MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use("/api/partenaires", partnerRoutes);

// Importation des routes d'inscription

// Utilisation des routes
app.use("/inscription", inscriptionRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
});
