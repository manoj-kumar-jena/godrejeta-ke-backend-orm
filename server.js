// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./database/connection');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');

const properties = require(`./properties/properties.json`);
const environment = properties.env.environment || 'development';
const config = require(`./config/config.${environment}.json`);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const authRoutes = require('./routes/authRoutes');
const itemCategoryRoutes = require('./routes/itemCategoryRoutes'); // Import your item category routes
const sectionRoutes = require('./routes/sectionRoutes'); // Import section routes
const shiftRoutes = require('./routes/shiftRoutes');
const workerTypeRoutes = require('./routes/workerTypeRoutes');
const employeeTypeRoutes = require('./routes/employeeTypeRoutes');
const itemCodeRoutes = require('./routes/itemCodeRoutes');
const itemSectionRoutes = require('./routes/itemSectionRoutes');
const itemRoutes = require('./routes/itemRoutes');
const targetPlanRoutes = require('./routes/targetPlanRoutes');

const app = express();

const PORT = config.server.port || 4000;
//const PORT = process.env.PORT || 4000;

// =================================== Middleware =====================================================

app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================================== Routes =========================================================

// Login Routes
app.use('/auth', authRoutes); // Authentication routes
// Item category routes
app.use('/api/item-category', authMiddleware.verifyToken, itemCategoryRoutes);// Singular endpoint
app.use('/api/item-categories', authMiddleware.verifyToken, itemCategoryRoutes);// Plural endpoint
//Section routes
app.use('/api/section', authMiddleware.verifyToken, sectionRoutes);// Singular endpoint
app.use('/api/sections', authMiddleware.verifyToken, sectionRoutes);// Plural endpoint
//Shift routes
app.use('/api/shift', authMiddleware.verifyToken, shiftRoutes);// Singular endpoint
app.use('/api/shifts', authMiddleware.verifyToken, shiftRoutes);// Plural endpoint
//WorkerType routes
app.use('/api/worker-type', authMiddleware.verifyToken, workerTypeRoutes);// Singular endpoint
app.use('/api/worker-types', authMiddleware.verifyToken, workerTypeRoutes);// Plural endpoint
//EmployeeType routes
app.use('/api/employee-type', authMiddleware.verifyToken, employeeTypeRoutes);// Singular endpoint
app.use('/api/employee-types', authMiddleware.verifyToken, employeeTypeRoutes);// Plural endpoint
// Item code routes
app.use('/api/item-code', authMiddleware.verifyToken, itemCodeRoutes);// Singular endpoint
app.use('/api/item-codes', authMiddleware.verifyToken, itemCodeRoutes);// Plural endpoint
// Item section routes
app.use('/api/item-section', authMiddleware.verifyToken, itemSectionRoutes);// Singular endpoint
app.use('/api/item-sections', authMiddleware.verifyToken, itemSectionRoutes);// Plural endpoint
// Item routes
app.use('/api/item', authMiddleware.verifyToken, itemRoutes);// Singular endpoint
app.use('/api/items', authMiddleware.verifyToken, itemRoutes);// Plural endpoint
// Target plan routes
app.use('/api/target-plan', authMiddleware.verifyToken, targetPlanRoutes);// Singular endpoint
app.use('/api/target-plans', authMiddleware.verifyToken, targetPlanRoutes);// Plural endpoint


// Database synchronization
// sequelize.sync()
//     .then(() => {
//         console.log('Database synced successfully');
//         // Start server
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch(error => {
//         console.error('Error syncing database:', error);
//     });



// Stop automatic table creation/update
// sequelize.sync({ force: false })
//     .then(() => {
//         console.log('Database synced successfully');
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
//     })
//     .catch(error => {
//         console.error('Error syncing database:', error);
//     });

// Manually create or update tables
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully');
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

// =================================== Middleware =====================================================

app.use(errorHandler); // Error handling middleware should come after other middleware
