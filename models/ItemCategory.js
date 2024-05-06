// models/ItemCategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ItemCategory = sequelize.define('ItemCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'item_category',
        timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
    });

module.exports = ItemCategory;
