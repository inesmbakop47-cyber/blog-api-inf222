const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const articlesRouter = require('./routes/articles');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API REST pour gérer un blog simple (INF222 - TAF1)',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/articles', articlesRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API - INF222 TAF1',
    documentation: `http://localhost:${PORT}/api-docs`,
  });
});

// Initialiser la base de données puis démarrer le serveur
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Documentation Swagger: http://localhost:${PORT}/api-docs`);
  });
});
