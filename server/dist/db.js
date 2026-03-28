import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
export const sequelize = new Sequelize(process.env.DB_NAME || 'notes_app', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'root', {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
});
