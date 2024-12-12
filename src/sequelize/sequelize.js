const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    port: Number(process.env.DB_PORT),
    pool: {
      max: 10,
      min: 0,
      acquire: 60000, // Time Sequelize will try to get a connection before throwing an error
      idle: 10000,
    },
    retry: {
      match: [
        /ECONNRESET/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
      ],
      max: 5, // Retry up to 5 times
    },
    dialectOptions: {
      encrypt: true, // If using Azure SQL, ensure encryption is enabled
    },
    logging: null,
  },
);

module.exports = sequelize;
