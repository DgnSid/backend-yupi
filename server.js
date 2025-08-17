const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Configuration Telegram (à remplacer)
const BOT_TOKEN = '7769334440:AAH67yTL7foEIU4k0vn8WUWdIf0m8YrBmlE'; // Ex: '6123456789:AAFkjsdhfkj...'
const LEADER_CHAT_ID = '5723002024'; 

// Initialisation du bot Telegram
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const app = express();
const port = 3000;

// Middleware (identique à votre version originale)
app.use(cors());
app.use(express.json());

// Endpoint pour recevoir les données d'inscription (adapté pour Telegram)
app.post('/api/register', async (req, res) => {
  const { nom, prenom, username, email, telephone, dateNaissance, adresse, region, packName } = req.body;

  if (!nom || !prenom || !username || !email || !telephone || !packName) {
    return res.status(400).json({ success: false, message: 'Données d\'inscription manquantes.' });
  }

  // Message formaté pour Telegram (avec Markdown pour une meilleure lisibilité)
  const messageBody = `
  🚀 **Nouvelle inscription YUPI GLOBAL** 🚀
  👤 *Nom complet*: ${nom} ${prenom}
  📱 *Téléphone*: ${telephone}
  📧 *Email*: ${email}
  🏷 *Username*: ${username}
  📦 *Pack*: ${packName}
  📍 *Région*: ${region || 'Non spécifiée'}
  🏠 *Adresse*: ${adresse || 'Non spécifiée'}
  `;

  try {
    // Envoi du message via Telegram (au lieu de Twilio)
    await bot.sendMessage(
      LEADER_CHAT_ID,
      messageBody,
      { parse_mode: 'Markdown' } // Activation du formatage Markdown
    );

    console.log(`Message Telegram envoyé au leader (ID: ${LEADER_CHAT_ID})`);
    res.status(200).json({ success: true, message: 'Données reçues et notification envoyée.' });

  } catch (error) {
    console.error('Erreur lors de l\'envoi Telegram:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la notification.' });
  }
});


app.post('/api/new-order', async (req, res) => {
  const { whatsappNumber, products, totalPrice } = req.body;

  if (!whatsappNumber || !products || products.length === 0 || !totalPrice) {
    return res.status(400).json({ success: false, message: 'Données de commande manquantes.' });
  }

  // Formatage de la liste des produits pour le message Telegram
  const productsList = products.map(p => `- ${p.name} : ${p.price.toLocaleString()} FCFA`).join('\n');

  // Message formaté pour Telegram
  const messageBody = `
  🛍️ **Nouvelle Commande** 🛍️
  
  👤 *Numéro WhatsApp du client*: ${whatsappNumber}
  
  *Produits commandés* :
  ${productsList}
  
  *Prix total* : ${totalPrice.toLocaleString()} FCFA
  
  📞 *Contactez le client pour finaliser la commande.*
  `;

  try {
    await bot.sendMessage(
      LEADER_CHAT_ID,
      messageBody,
      { parse_mode: 'Markdown' }
    );

    console.log(`Message Telegram de nouvelle commande envoyé au leader (ID: ${LEADER_CHAT_ID})`);
    res.status(200).json({ success: true, message: 'Commande reçue et notification envoyée.' });

  } catch (error) {
    console.error('Erreur lors de l\'envoi Telegram de la commande:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la notification de commande.' });
  }
});

// Démarrer le serveur (identique)
app.listen(port, () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});