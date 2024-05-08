// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('geopos_user', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    pass: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    entryid: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(100),
        defaultValue: null,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    last_login: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    last_activity: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    date_created: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    forgot_exp: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    remember_time: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    remember_exp: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    verification_code: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    totp_secret: {
        type: DataTypes.STRING(16),
        defaultValue: null,
    },
    ip_address: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING(50),
        defaultValue: 'example.png',
    },
    loc: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cid: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    lang: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'english',
    },
    user_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'geopos_users',
    timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = User;
