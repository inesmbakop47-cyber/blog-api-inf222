const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articlesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titre:
 *           type: string
 *           example: "Introduction au Web"
 *         contenu:
 *           type: string
 *           example: "Le développement web comprend..."
 *         auteur:
 *           type: string
 *           example: "Ines"
 *         date:
 *           type: string
 *           example: "2026-03-23"
 *         categorie:
 *           type: string
 *           example: "Technologie"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["web", "backend"]
 *     ArticleInput:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *         - date
 *         - categorie
 *       properties:
 *         titre:
 *           type: string
 *         contenu:
 *           type: string
 *         auteur:
 *           type: string
 *         date:
 *           type: string
 *         categorie:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Creer un article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article cree avec succes
 *       400:
 *         description: Donnees invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', ctrl.createArticle);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par titre ou contenu
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des articles correspondants
 *       400:
 *         description: Parametre query manquant
 */
router.get('/search', ctrl.searchArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Recuperer tous les articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get('/', ctrl.getArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Recuperer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouve
 *       404:
 *         description: Article non trouve
 */
router.get('/:id', ctrl.getArticleById);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article mis a jour
 *       404:
 *         description: Article non trouve
 */
router.put('/:id', ctrl.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprime
 *       404:
 *         description: Article non trouve
 */
router.delete('/:id', ctrl.deleteArticle);

module.exports = router;
