// models/TargetPlan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const TargetPlan = sequelize.define('TargetPlan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    plan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    datetime: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'target_plan',
    timestamps: false // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = TargetPlan;