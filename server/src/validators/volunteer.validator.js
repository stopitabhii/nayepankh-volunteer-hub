import { body } from "express-validator";

const updateProfileValidator = [
  body("bio")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bio must be under 1000 characters"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings"),

  body("skills.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Each skill must be between 1 and 60 characters"),

  body("availability")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Availability must be under 120 characters"),

  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
];

export { updateProfileValidator };