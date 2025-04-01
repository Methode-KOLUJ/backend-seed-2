const express = require("express");
require("dotenv").config();

const router = express.Router();

// Données d'entraînement intégrées directement dans le fichier serveur
const trainingData = {
  BOT_NAME: "SEED Assistant",
  SYSTEM_PROMPT: "Tu es SEED Assistant, un expert précis et bienveillant sur l'organisation 'Sauvons l'Enfance en Difficulté' (SEED) et la Boutique SEED .C.C. Réponds de manière concise, claire et empathique, en te basant uniquement sur les informations suivantes :\n\n- **SEED** :\n  - Fondation : SEED a été fondée en RDC le 25 janvier 2020 et au Canada le 4 janvier 2021 par le Professeur et évangéliste Jeannot Kashala.\n  - Mission : Offrir un soutien éducatif, thérapeutique et préventif aux enfants vulnérables, notamment ceux touchés par des anomalies.\n  - Actions : En 2019, SEED a distribué des masques, désinfectants et vivres alimentaires en RDC durant la pandémie de COVID-19.\n  - Communication : SEED utilise ses chaînes YouTube : ONG SEED TV, SEED TV Cinéma, 3 Savoirs TV et CVA TV.\n  - Équipe : 20 intervenants, 10 bénévoles et 7 professionnels de la presse (3 consultants, 2 journalistes, 2 caméramans).\n  - Bénéficiaires : 200 enfants à Kinshasa, 100 à Matadi et 10 au Canada.\n  - Objectif : Étendre son action à Lubumbashi, Mbuji-Mayi, Bandundu et l'Est de la RDC d'ici 3 ans pour atteindre 1 000 enfants.\n\n- **Boutique SEED .C.C** :\n  - Fondation : Fondée en 2023 par Jeannot Kashala et son épouse Laura Kashala.\n  - Mission : Allier exclusivité et mission solidaire, en soutenant le projet « Sauvons l’Enfance en Difficulté Atteinte d’une Anomalie ».\n  - Design et Esthétique : Espace moderne et épuré, avec des teintes douces, un éclairage soigné et des matériaux de qualité.\n  - Produits : Gamme élégante de vêtements personnalisés arborant le logo SEED, conçus avec soin pour offrir un style unique et intemporel.\n  - Engagement Social :\n    - Soutien aux enfants et familles vulnérables grâce à des services éducatifs, thérapeutiques et de soutien.\n    - Revenus utilisés pour financer les frais de scolarité, soutenir une banque alimentaire et créer des opportunités d’emploi.\n  - Expérience Client : Parcours d’achat esthétique et émotionnel, en ligne ou en boutique.\n  - Valeurs : Générosité, solidarité et élégance.\n\n- **Portrait de Jeannot et Laura Kashala** :\n  - Jeannot Kashala : Éducateur spécialisé, dédié à l’accompagnement des enfants en difficulté.\n  - Laura Kashala : Travailleuse sociale et éducatrice en petite enfance.\n  - Leur Union : Mariés en 2003, officialisés en 2007, parents de cinq enfants.\n  - Leur Impact : Leur synergie familiale renforce leur vision d’une éducation et d’un soutien social inclusifs.\n\n⚠️ **Règles impératives** :\n- Réponds avec précision sans ajouter d'informations non demandées.\n- Reste direct et clair dans tes réponses.\n- Si une question est hors sujet, réponds poliment : 'Je suis spécialisé sur l'ONG SEED et la Boutique SEED .C.C. Je ne peux pas répondre à cette question.'\n- Ne divulgue jamais d’informations non mentionnées ici.\n- Tu as été Développé par KONGOLO LULU Jean-Claude (KOLUJ_DEV), Développeur Web basé à Lubumbashi, RDC.",
  greetings: [
    "Bonjour ! Comment puis-je t’aider sur SEED ou la Boutique SEED .C.C ?",
    "Salut ! Que veux-tu savoir sur SEED ou la Boutique SEED .C.C ?",
    "Coucou ! Pose-moi ta question sur SEED ou la Boutique SEED .C.C.",
    "Hey ! Je suis là pour t’informer sur SEED et la Boutique SEED .C.C.",
    "Hello ! Comment puis-je t’aider à mieux comprendre SEED ou la Boutique SEED .C.C ?",
  ],
};

const { BOT_NAME, SYSTEM_PROMPT, greetings } = trainingData;
let conversationHistory = [];

router.post("/", async (req, res) => {
  const userMessage = req.body.message?.trim().toLowerCase();

  // Vérifier si le message est vide
  if (!userMessage) {
    return res.status(400).json({ error: "Message manquant" });
  }

  // Répondre aux salutations
  if (greetings.some((greeting) => userMessage.includes(greeting.toLowerCase()))) {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return res.json({ reply: randomGreeting });
  }

  // Éviter les répétitions
  if (conversationHistory.length > 0) {
    const lastUserMessage = conversationHistory[conversationHistory.length - 1].content;
    if (lastUserMessage === userMessage) {
      return res.json({ reply: "Je viens déjà de répondre à cette question." });
    }
  }

  // Ajouter le message de l'utilisateur à l'historique
  conversationHistory.push({ role: "user", content: userMessage });

  try {
    // Appeler l'API OpenRouter pour obtenir une réponse
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory,
        ],
      }),
    });

    const data = await response.json();
    let botReply = data.choices?.[0]?.message?.content || "Veuillez reformuler votre question.";

    // Supprimer les symboles * des réponses
    botReply = botReply.replace(/\*/g, "");

    // Ajouter la réponse du bot à l'historique
    conversationHistory.push({ role: "assistant", content: botReply });

    // Limiter l'historique à 10 messages (5 tours de conversation)
    if (conversationHistory.length > 10) {
      conversationHistory.splice(0, 2);
    }

    // Renvoyer la réponse du bot
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;