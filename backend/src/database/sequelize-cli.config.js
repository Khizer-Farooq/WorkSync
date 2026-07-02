require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  production: {
    use_env_variable: 'DATABASE_DIRECT', // separate var, non-pooled
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};