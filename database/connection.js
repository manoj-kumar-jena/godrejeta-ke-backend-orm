// database/connection.js
const { Sequelize } = require('sequelize');

const properties = require(`../properties/properties.json`);
const environment = properties.env.environment || 'development';
const config = require(`../config/config.${environment}.json`);

// const sequelize = new Sequelize(config.database.databaseName, config.database.username, config.database.password, {
//     host: config.database.host,
//     dialect: 'mysql',
// });

const sequelize = new Sequelize(config.database.databaseName, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: 'mysql',
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0, // Minimum number of connections in the pool
        acquire: 30000, // Maximum time in milliseconds that a connection can be acquired before an error occurs
        idle: 10000 // Maximum time in milliseconds that a connection can remain idle before being released
    }
});

module.exports = sequelize;