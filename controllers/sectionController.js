// controllers/sectionController.js
const sectionService = require('../services/sectionService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.createSection = async (req, res, next) => {
    try {
        const { section_name } = req.body;
        // Validate input
        if (!section_name || !section_name.trim()) {
            throw new CustomError(400, 'Section name is required');
        }
        // Proceed with section creation
        const newSection = await sectionService.createSection(section_name);
        res.status(200).json(new ApiResponse(200, newSection, "Section created successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getAllSections = async (req, res, next) => {
    try {
        // Fetch roleId and userId from the req object
        const { roleId, userId } = req;

        let sections;
        // Check if roleId is 5 (assuming roleId 5 corresponds to a specific role)
        if (roleId === 5) {
            // Fetch all sections if roleId is 5
            sections = await sectionService.getAllSections();
        } else {
            // Fetch sections by userId if roleId is not 5
            sections = await sectionService.getSectionsByUserId(userId);
        };
        res.status(200).json(new ApiResponse(200, sections));

    } catch (error) {
        next(error);
    }
};

exports.getSectionById = async (req, res, next) => {
    try {
        // Extract section ID from request parameters
        const sectionId = req.params.id;

        // Validate input
        if (!sectionId || !sectionId.trim() || isNaN(sectionId)) {
            throw new CustomError(400, 'Section ID is required');
        }

        const section = await sectionService.getSectionById(sectionId);

        if (!section) {
            throw new CustomError(400, 'Section not found');
        }
        res.status(200).json(new ApiResponse(200, section));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.updateSection = async (req, res, next) => {
    try {
        // Extract section ID from request parameters
        const sectionId = req.params.id;
        const { section_name } = req.body;

        // Validate input
        if (!sectionId || !sectionId.trim() || isNaN(sectionId)) {
            throw new CustomError(400, 'Section ID is required');
        }
        if (!section_name || !section_name.trim()) {
            throw new CustomError(400, 'Section name is required');
        }

        // Update the section
        const updatedSection = await sectionService.updateSection(sectionId, section_name);
        res.status(200).json(new ApiResponse(200, updatedSection, "Section updated successfully"));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.deleteSection = async (req, res, next) => {
    try {
        // Extract section ID from request parameters
        const sectionId = req.params.id;

        // Validate input
        if (!sectionId || !sectionId.trim() || isNaN(sectionId)) {
            throw new CustomError(400, 'Section ID is required');
        }
        const deletedSection = await sectionService.deleteSection(sectionId);
        if (!deletedSection) {
            throw new CustomError(400, 'Section not found');
        }
        res.status(200).json(new ApiResponse(200, deletedSection, "Section deleted successfully"));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.getTotalSectionCount = async (req, res, next) => {
    try {
        // Get total count of sections from the service
        const totalCount = await sectionService.getTotalSectionCount();

        // Prepare response object
        const response = new ApiResponse(200, { totalSection: totalCount }, "Total section count retrieved successfully");

        // Send response
        res.status(200).json(response);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
