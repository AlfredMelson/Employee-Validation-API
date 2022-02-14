import { body, param, query } from 'express-validator'

class AdministratorValidator {
  checkCreateAdministrator() {
    return [
      // Username requirements: must start with a lowercase or uppercase letter followed by 3 to 23 characters that may letters, numbers, underscores, or hyphens
      body('username').notEmpty().withMessage('Username value should not be empty'),
      // Password requirements: must start with a lowercase or uppercase letter followed by 3 to 23 characters that may letters, numbers, underscores, or hyphens
      body('password').notEmpty().withMessage('Password value should not be empty'),
      // Email address requirements:
      body('email').notEmpty().withMessage('Email value should not be empty')
    ]
  }
  checkReadAdministrator() {
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

export default new AdministratorValidator()
