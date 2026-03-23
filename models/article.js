const { getDb } = require('../database/db');

const Article = {
  // Créer un article
  create(data) {
    return new Promise((resolve, reject) => {
      const { titre, contenu, auteur, date, categorie, tags } = data;
      const tagsJson = JSON.stringify(tags || []);
      const db = getDb();
      db.run(
        `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [titre, contenu, auteur, date, categorie, tagsJson],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data, tags: tags || [] });
        }
      );
    });
  },

  // Lire tous les articles (avec filtres optionnels)
  findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM articles WHERE 1=1';
      const params = [];

      if (filters.categorie) {
        query += ' AND categorie = ?';
        params.push(filters.categorie);
      }
      if (filters.auteur) {
        query += ' AND auteur = ?';
        params.push(filters.auteur);
      }
      if (filters.date) {
        query += ' AND date = ?';
        params.push(filters.date);
      }

      query += ' ORDER BY created_at DESC';

      getDb().all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') })));
      });
    });
  },

  // Lire un article par ID
  findById(id) {
    return new Promise((resolve, reject) => {
      getDb().get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else resolve({ ...row, tags: JSON.parse(row.tags || '[]') });
      });
    });
  },

  // Modifier un article
  update(id, data) {
    return new Promise((resolve, reject) => {
      const { titre, contenu, categorie, tags } = data;
      const tagsJson = tags ? JSON.stringify(tags) : undefined;

      const fields = [];
      const params = [];

      if (titre !== undefined) { fields.push('titre = ?'); params.push(titre); }
      if (contenu !== undefined) { fields.push('contenu = ?'); params.push(contenu); }
      if (categorie !== undefined) { fields.push('categorie = ?'); params.push(categorie); }
      if (tagsJson !== undefined) { fields.push('tags = ?'); params.push(tagsJson); }

      if (fields.length === 0) {
        return reject(new Error('Aucun champ à mettre à jour'));
      }

      params.push(id);
      getDb().run(
        `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
        params,
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  // Supprimer un article
  delete(id) {
    return new Promise((resolve, reject) => {
      getDb().run('DELETE FROM articles WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },

  // Recherche par titre ou contenu
  search(query) {
    return new Promise((resolve, reject) => {
      const like = `%${query}%`;
      getDb().all(
        'SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ? ORDER BY created_at DESC',
        [like, like],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') })));
        }
      );
    });
  },
};

module.exports = Article;
