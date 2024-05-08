// models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Employee = sequelize.define('employees_moz', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(30),
        defaultValue: null,
    },
    entryid: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    name: {
        type: DataTypes.STRING(50),
        defaultValue: null,
    },
    passive_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'ACT',
    },
    address: {
        type: DataTypes.STRING(100),
        defaultValue: null,
    },
    city: {
        type: DataTypes.STRING(50),
        defaultValue: null,
    },
    region: {
        type: DataTypes.STRING(50),
        defaultValue: null,
    },
    country: {
        type: DataTypes.STRING(50),
        defaultValue: null,
    },
    postbox: {
        type: DataTypes.STRING(20),
        defaultValue: null,
    },
    phone: {
        type: DataTypes.STRING(15),
        defaultValue: null,
    },
    phonealt: {
        type: DataTypes.STRING(15),
        defaultValue: null,
    },
    picture: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'example.png',
    },
    sign: {
        type: DataTypes.STRING(100),
        defaultValue: 'sign.png',
    },
    joindate: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    type: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    dept: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    degis: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    salary: {
        type: DataTypes.DECIMAL(15, 4),
        defaultValue: null,
    },
    clock: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    clockin: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    clockout: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    c_rate: {
        type: DataTypes.DECIMAL(16, 2),
        defaultValue: null,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    worker_role: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    workertype: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    shift: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    product: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    line: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    section_id: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    emp_count: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'P',
    },
    date: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    yes_status: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    yes_date: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    site: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    update_date: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    yes_status_new: {
        type: DataTypes.STRING(25),
        defaultValue: null,
    },
    yes_date_new: {
        type: DataTypes.STRING(25),
        defaultValue: null,
    },
}, {
    tableName: 'employees_moz',
    timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = Employee;
