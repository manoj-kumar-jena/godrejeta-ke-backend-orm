// models/Section.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Section = sequelize.define('section', {
    section_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    target_unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    section_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
    {
        tableName: 'section',
        timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
    });

module.exports = Section;
