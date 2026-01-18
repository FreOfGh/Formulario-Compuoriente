const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.APP_ENV === 'production';

const dbConfig = isProduction 
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Obligatorio para Railway
      }
    : {
        host: process.env.test_db_host,
        port: process.env.test_db_port,
        user: process.env.test_db_user,
        password: process.env.test_db_password,
        database: process.env.test_db_name,
        // En local normalmente no necesitas SSL
      };

const pool = new Pool(dbConfig);

pool.on('connect', () => {
    const target = isProduction ? 'RAILWAY' : 'LOCALHOST';
    console.log(`✅ Base de datos conectada en: ${target}`);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};