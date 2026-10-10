import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const configuredOrigins = rawCorsOrigin.split(',').map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        configuredOrigins.includes('*') ||
        configuredOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'EcoCycle Campus REST API',
    timestamp: new Date().toISOString(),
  });
});

// Interactive API Documentation Endpoint
app.get('/api/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EcoCycle Campus API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
        <style>body { margin: 0; padding: 0; background: #0f172a; }</style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: '/api/v1/openapi.json',
              dom_id: '#swagger-ui',
            });
          };
        </script>
      </body>
    </html>
  `);
});

app.get('/api/v1/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'EcoCycle Campus API',
      version: '1.0.0',
      description: 'RESTful API for Campus E-Waste Collection, Repair, Reuse & Recycling Platform',
    },
    paths: {
      '/auth/login': { post: { summary: 'Login user' } },
      '/auth/register': { post: { summary: 'Register user' } },
      '/devices': { get: { summary: 'List all devices with filters' } },
      '/devices/{assetNumber}': { get: { summary: 'Get complete device lifecycle details by Asset QR Number' } },
      '/ewaste/submissions': { post: { summary: 'Submit e-waste for collection' } },
      '/repairs': { get: { summary: 'List active technician repair tickets' } },
      '/reuse/listings': { get: { summary: 'Get refurbished marketplace listings' } },
      '/impact': { get: { summary: 'Get campus sustainability impact metrics' } },
    },
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EcoCycle Campus API server running at http://localhost:${PORT}`);
  console.log(`📄 API Documentation available at http://localhost:${PORT}/api/docs`);
});
