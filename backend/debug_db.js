const mysql = require('mysql2/promise');
require('dotenv').config();

async function debug() {
    console.log('Connecting to:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    });

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.PORT || 3306
        });
        console.log('✅ Connection to MySQL host successful');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Database ${process.env.DB_NAME} checked/created`);

        await connection.query(`USE ${process.env.DB_NAME}`);

        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                api_key VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const q of queries) {
            await connection.query(q);
        }
        console.log('✅ Tables checked/created');

        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error('❌ DB Debug Error:', e);
        process.exit(1);
    }
}

debug();
