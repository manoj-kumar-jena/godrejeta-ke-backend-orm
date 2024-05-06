// models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER(100),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER(100),
        allowNull: false
    },
    subcategory_id: {
        type: DataTypes.INTEGER(100),
        allowNull: true
    },
    item_group: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    item_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    kg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    string: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pcs: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    line: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'item_masterr',
    timestamps: false // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = Item;
