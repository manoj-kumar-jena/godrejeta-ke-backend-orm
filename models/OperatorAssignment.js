// models/OperatorAssignment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OperatorAssignment = sequelize.define('operator_assign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    product_name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    line: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    section: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shift: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    loc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    site: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'operator_assign',
    timestamps: false // Disable timestamps (createdAt and updatedAt)
});

module.exports = OperatorAssignment;
