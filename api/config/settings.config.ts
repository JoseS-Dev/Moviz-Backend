import dotenv from 'dotenv';

dotenv.config();

export const settings = {
    databaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT || 3000,
    basePath: process.env.BASE_PATH || '/api',
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    corsOrigin: process.env.CORS_ORIGIN || '*',
}