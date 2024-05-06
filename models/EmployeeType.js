// models/EmployeeType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const EmployeeType = sequelize.define('EmployeeType', {
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
},
    {
        tableName: 'geopos_emptype',
        timestamps: false
    });

module.exports = EmployeeType;
