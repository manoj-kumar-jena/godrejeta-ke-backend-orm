// models/ItemCode.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ItemCode = sequelize.define('ItemCode', {
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
    product_code: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    product_des: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    loc: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},
    {
        tableName: 'item_code',
        timestamps: false // Disable timestamps (createdAt and updatedAt columns)
    });

module.exports = ItemCode;
