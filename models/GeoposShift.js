const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const GeoposShift = sequelize.define('GeoposShift', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nhrs: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'geopos_shift',
    timestamps: false // Disable timestamps
});

module.exports = GeoposShift;
