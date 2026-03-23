const Article = require('../models/article');

// POST /api/articles — Créer un article
async function createArticle(req, res) {
  try {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    if (!titre || titre.trim() === '') {
      return res.status(400).json({ error: 'Le titre est obligatoire.' });
    }
    if (!contenu || contenu.trim() === '') {
      return res.status(400).json({ error: 'Le contenu est obligatoire.' });
    }
    if (!auteur || auteur.trim() === '') {
      return res.status(400).json({ error: "L'auteur est obligatoire." });
    }
    if (!date) {
      return res.status(400).json({ error: 'La date est obligatoire.' });
    }
    if (!categorie || categorie.trim() === '') {
      return res.status(400).json({ error: 'La catégorie est obligatoire.' });
    }

    const article = await Article.create({ titre, contenu, auteur, date, categorie, tags });
    res.status(201).json({ message: 'Article créé avec succès.', article });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

// GET /api/articles — Lire tous les articles
async function getArticles(req, res) {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = await Article.findAll({ categorie, auteur, date });
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

// GET /api/articles/search — Rechercher des articles
async function searchArticles(req, res) {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Le paramètre "query" est requis.' });
    }
    const articles = await Article.search(query);
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

// GET /api/articles/:id — Lire un article par ID
async function getArticleById(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }
    res.status(200).json({ article });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

// PUT /api/articles/:id — Modifier un article
async function updateArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    const changes = await Article.update(req.params.id, req.body);
    if (changes === 0) {
      return res.status(400).json({ error: 'Aucune modification effectuée.' });
    }

    const updated = await Article.findById(req.params.id);
    res.status(200).json({ message: 'Article mis à jour avec succès.', article: updated });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

// DELETE /api/articles/:id — Supprimer un article
async function deleteArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    await Article.delete(req.params.id);
    res.status(200).json({ message: `Article #${req.params.id} supprimé avec succès.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
}

module.exports = {
  createArticle,
  getArticles,
  searchArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
