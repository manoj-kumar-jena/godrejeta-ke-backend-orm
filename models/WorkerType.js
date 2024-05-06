// models/WorkerType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const WorkerType = sequelize.define('WorkerType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'geopos_workertype',
    timestamps: false // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = WorkerType;
