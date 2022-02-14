import { body, param, query } from 'express-validator'

class EmployeeValidator {
  checkCreateEmployee() {
    return [
      // Emplyee Name requirements:
      body('emplName').notEmpty().withMessage('Name value should not be empty'),
      // Employee Role requirements:
      body('emplRole').notEmpty().withMessage('Role value should not be empty'),
      // Email address requirements:
      body('emplEmail').notEmpty().withMessage('Email value should not be empty')
    ]
  }
  checkReadEmployee() {
    return [
      query('limit')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('The limit value should be number and between 1-10'),
      query('offset').optional().isNumeric().withMessage('The value should be number')
    ]
  }
  checkIdParam() {
    return [
      param('id')
        .notEmpty()
        .withMessage('The value should be not empty')
        .isUUID(4)
        .withMessage('The value should be uuid v4')
    ]
  }
}

export default new EmployeeValidator()
