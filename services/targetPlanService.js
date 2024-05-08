// services/targetPlanService.js
const TargetPlan = require('../models/TargetPlan');
const Item = require('../models/Item');
const { sequelize } = require('../models/TargetPlan');
const { CustomError } = require('../utils/error');
const dateUtils = require('../utils/dateUtils');
const ExcelJS = require('exceljs');
const fs = require('fs');

exports.insertOrUpdate = async (records) => {
    let createdCount = 0;
    let updatedCount = 0;
    let transaction;

    try {
        // Start a transaction
        transaction = await sequelize.transaction();
        // Use Promise.all to process each record concurrently
        await Promise.all(records.map(async (record) => {
            const { product_id, plan, date } = record;

            // Check if the record already exists
            const existingRecord = await TargetPlan.findOne({
                where: {
                    product_id: product_id,
                    datetime: date
                }
            });

            if (existingRecord) {
                // Update the existing record
                await existingRecord.update({ plan: plan });
                updatedCount++;
            } else {
                // Insert a new record
                await TargetPlan.create({ product_id: product_id, plan: plan, datetime: date });
                createdCount++;
            }
        }));
        // If everything is successful, commit the transaction
        await transaction.commit();

        return { updatedCount: updatedCount, createdCount: createdCount };
    } catch (error) {
        // If an error occurs, rollback the transaction
        if (transaction) await transaction.rollback();
        throw error; // Re-throw the error to be handled by the caller
    }
};

exports.getTargetPlansByDatetime = async (datetime) => {

    const query = `
            SELECT target_plan.*, item_masterr.item_description, item_masterr.item_group
            FROM target_plan
            LEFT JOIN item_masterr ON target_plan.product_id = item_masterr.id
            WHERE target_plan.datetime = ?
        `;

    // Execute the query
    const targetPlans = await sequelize.query(query, {
        replacements: [datetime],
        type: sequelize.QueryTypes.SELECT
    });

    return targetPlans;
};

exports.deleteTargetPlan = async (targetPlanId) => {
    const targetPlan = await TargetPlan.findByPk(targetPlanId);
    if (!targetPlan) {
        throw new CustomError(404, 'Target plan not found');
    }
    return await targetPlan.destroy();
};

exports.getTargetPlansForThisMonth = async () => {

    const items = await Item.findAll();
    const thisMonthDatesArray = dateUtils.getThisMonthAllDates("DD-MM-YYYY");

    // Process each item to create a row for this month with all dates and plans
    const processedResult = [];
    for (const item of items) {
        const processedRow = {
            item_id: item.id,
            item_group: item.item_group,
            item_description: item.item_description
        };

        for (let index = 0; index < thisMonthDatesArray.length; index++) {
            const date = thisMonthDatesArray[index];

            // Find plan for the specific date
            const targetPlan = await TargetPlan.findOne({
                where: {
                    product_id: item.id,
                    datetime: date
                },
                attributes: ['plan']
            });

            const dayKey = "day" + index;
            processedRow[dayKey] = targetPlan ? targetPlan.plan : "-";
        }

        processedResult.push(processedRow);
    }
    return processedResult;
};

exports.importFromExcel = async (filePath) => {
    try {
        const notFoundItems = []; // Array to store descriptions of items not found in the database

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1); // Assuming data is in the first worksheet
        // Initialize a variable to track whether the current row is the first row
        let isFirstRow = true;
        // Iterate over each row in the worksheet
        // Process each row in the worksheet
        await new Promise((resolve, reject) => {
            worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
                // Skip the first row (header row)
                if (isFirstRow) {
                    isFirstRow = false; // Set isFirstRow to false for subsequent rows
                    return;
                }
                const itemDescription = row.getCell('A').value; // Assuming item description is in column A
                const itemGroup = row.getCell('B').value; // Assuming item group is in column B
                const plan = row.getCell('C').value; // Assuming plan is in column C
                const date = row.getCell('D').value; // Assuming date is in column D
                //console.log(itemDescription, itemGroup, plan, date);

                // Fetch item from database based on item description
                const item = await Item.findOne({ where: { item_description: itemDescription } });

                if (!item) {
                    // Log the error and continue processing other rows
                    console.log(`Item with description '${itemDescription}' not found`);
                    notFoundItems.push(itemDescription); // Store the description in the array
                }
                else {
                    // Find or create target plan for the item and date
                    let targetPlan = await TargetPlan.findOne({
                        where: {
                            product_id: item.id,
                            datetime: date
                        }
                    });

                    if (!targetPlan) {
                        // If target plan does not exist, create it
                        targetPlan = await TargetPlan.create({ product_id: item.id, plan: plan, datetime: date });
                    } else {
                        // If target plan exists, update it
                        await targetPlan.update({ plan: plan });
                    }
                }
                // Resolve the promise when all rows have been processed
                if (rowNumber === worksheet.rowCount) resolve();
            });
        });
        // Delete the uploaded file after import
        fs.unlinkSync(filePath);
        return { notFoundItems: notFoundItems };
    } catch (error) {
        throw error;
    }
};