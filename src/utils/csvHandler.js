import fs from "fs";
import csv from "csv-parser";
import pool from "../config/db.js";
import { ApiError } from "./apiError.js";
import { asyncHandler } from "./acyncHandler.js";

const validateNumeric = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new ApiError(400, `Invalid numeric value for ${fieldName}: ${value}`);
  }
  return num;
};

const validateInteger = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    throw new ApiError(400, `Invalid integer value for ${fieldName}: ${value}`);
  }
  return num;
};

// Normalize CSV row keys from "Make Name" format to "make_name" format
const normalizeRow = (row) => {
  const normalized = {};
  for (const [key, value] of Object.entries(row)) {
    // Convert "Make Name" or "Engine Horsepower Hp" to "make_name" or "engine_horsepower_hp"
    const normalizedKey = key.toLowerCase().replace(/\s+/g, "_");
    normalized[normalizedKey] = value;
  }
  return normalized;
};

const validateRow = (row) => {
  // Normalize row keys to handle both formats
  const normalizedRow = normalizeRow(row);

  // Required fields validation
  if (
    !normalizedRow.make_name ||
    !normalizedRow.model_name ||
    !normalizedRow.engine_type ||
    !normalizedRow.body_type
  ) {
    return {
      valid: false,
      error:
        "Missing required fields: make_name, model_name, engine_type, body_type",
    };
  }

  // Numeric fields validation
  try {
    const validatedRow = {
      make_name: normalizedRow.make_name.trim(),
      model_name: normalizedRow.model_name.trim(),
      trim_name: normalizedRow.trim_name?.trim() || null,
      trim_description: normalizedRow.trim_description?.trim() || null,
      engine_type: normalizedRow.engine_type.trim(),
      engine_fuel_type: normalizedRow.engine_fuel_type?.trim() || null,
      engine_cylinders: validateInteger(
        normalizedRow.engine_cylinders,
        "engine_cylinders"
      ),
      engine_size: validateNumeric(normalizedRow.engine_size, "engine_size"),
      engine_horsepower_hp: validateInteger(
        normalizedRow.engine_horsepower_hp,
        "engine_horsepower_hp"
      ),
      engine_horsepower_rpm: validateInteger(
        normalizedRow.engine_horsepower_rpm,
        "engine_horsepower_rpm"
      ),
      engine_drive_type: normalizedRow.engine_drive_type?.trim() || null,
      body_type: normalizedRow.body_type.trim(),
      body_doors: validateInteger(normalizedRow.body_doors, "body_doors"),
      body_seats: validateInteger(normalizedRow.body_seats, "body_seats"),
    };

    return { valid: true, data: validatedRow };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Check if car already exists in database
const checkCarExists = async (car) => {
  const [rows] = await pool.query(
    `SELECT id FROM cars WHERE 
      make_name = ? AND 
      model_name = ? AND 
      (trim_name = ? OR (trim_name IS NULL AND ? IS NULL)) AND
      engine_type = ? AND 
      body_type = ?
    LIMIT 1`,
    [
      car.make_name,
      car.model_name,
      car.trim_name,
      car.trim_name,
      car.engine_type,
      car.body_type,
    ]
  );
  return rows.length > 0;
};

export const importCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const validCars = [];
  const invalidRows = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        rowNumber++;
        const validation = validateRow(row);

        if (validation.valid) {
          validCars.push({ ...validation.data, rowNumber });
        } else {
          invalidRows.push({
            row: rowNumber,
            error: validation.error,
            data: row,
          });
        }
      })
      .on("end", async () => {
        try {
          // Delete the uploaded file
          fs.unlinkSync(req.file.path);

          // Insert valid cars into database after checking if they exist
          let insertedCount = 0;
          let duplicateCount = 0;
          const errors = [];
          const duplicates = [];

          for (const carWithRow of validCars) {
            const { rowNumber: carRowNumber, ...car } = carWithRow;
            try {
              // Check if car already exists in database
              const exists = await checkCarExists(car);

              if (exists) {
                duplicateCount++;
                duplicates.push({
                  row: carRowNumber,
                  data: car,
                  reason: "Car already exists in database",
                });
              } else {
                // Insert only if not exists
                await pool.query("INSERT INTO cars SET ?", [car]);
                insertedCount++;
              }
            } catch (error) {
              errors.push({
                row: carRowNumber,
                car,
                error: error.message,
              });
            }
          }

          res.status(200).json({
            success: true,
            message: "CSV import completed",
            data: {
              totalRows: rowNumber,
              validRows: validCars.length,
              insertedRows: insertedCount,
              duplicateRows: duplicateCount,
              invalidRows: invalidRows.length,
              errors: errors.length,
              invalidRowDetails: invalidRows,
              duplicateDetails: duplicates,
              insertErrors: errors,
            },
          });

          resolve();
        } catch (error) {
          // Clean up file if still exists
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          reject(error);
        }
      })
      .on("error", (error) => {
        // Clean up file if still exists
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        reject(new ApiError(400, `Error parsing CSV: ${error.message}`));
      });
  });
});
