// models/ItemSection.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ItemSection = sequelize.define('ItemSection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    utarget: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    n_target: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'item_section_moz',
    timestamps: false
});

module.exports = ItemSection;
