import pool from "../config/db.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const createCar = asyncHandler(async (req, res) => {
  const {
    make_name,
    model_name,
    trim_name,
    trim_description,
    engine_type,
    engine_fuel_type,
    engine_cylinders,
    engine_size,
    engine_horsepower_hp,
    engine_horsepower_rpm,
    engine_drive_type,
    body_type,
    body_doors,
    body_seats,
  } = req.body;

  // Validate required fields
  if (!make_name || !model_name || !engine_type || !body_type) {
    throw new ApiError(
      400,
      "Make name, model name, engine_type and body_type are required"
    );
  }

  const carData = {
    make_name,
    model_name,
    trim_name: trim_name || null,
    trim_description: trim_description || null,
    engine_type: engine_type,
    engine_fuel_type: engine_fuel_type || null,
    engine_cylinders: engine_cylinders || null,
    engine_size: engine_size || null,
    engine_horsepower_hp: engine_horsepower_hp || null,
    engine_horsepower_rpm: engine_horsepower_rpm || null,
    engine_drive_type: engine_drive_type || null,
    body_type: body_type,
    body_doors: body_doors || null,
    body_seats: body_seats || null,
  };

  const [result] = await pool.query("INSERT INTO cars SET ?", [carData]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: result.insertId, ...carData },
        "Car created successfully"
      )
    );
});

export const getCars = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Get total count
  const [countResult] = await pool.query("SELECT COUNT(*) as total FROM cars");
  const total = countResult[0].total;

  // Get paginated results
  const [rows] = await pool.query("SELECT * FROM cars LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cars: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Cars fetched successfully"
    )
  );
});

export const getCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM cars WHERE id = ?", [id]);

  if (rows.length === 0) {
    throw new ApiError(404, "Car not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, rows[0], "Car fetched successfully"));
});

export const updateCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if car exists
  const [existingCars] = await pool.query("SELECT * FROM cars WHERE id = ?", [
    id,
  ]);

  if (existingCars.length === 0) {
    throw new ApiError(404, "Car not found");
  }

  const {
    make_name,
    model_name,
    trim_name,
    trim_description,
    engine_type,
    engine_fuel_type,
    engine_cylinders,
    engine_size,
    engine_horsepower_hp,
    engine_horsepower_rpm,
    engine_drive_type,
    body_type,
    body_doors,
    body_seats,
  } = req.body;

  // PUT requires all required fields but some fields are accept null value so if one field missing then also work api for PUT operation
  if (!make_name || !model_name || !engine_type || !body_type) {
    throw new ApiError(
      400,
      "make_name, model_name, engine_type, and body_type are required"
    );
  }

  const carData = {
    make_name,
    model_name,
    trim_name,
    trim_description,
    engine_type,
    engine_fuel_type,
    engine_cylinders,
    engine_size,
    engine_horsepower_hp,
    engine_horsepower_rpm,
    engine_drive_type,
    body_type,
    body_doors,
    body_seats,
  };

  await pool.query("UPDATE cars SET ? WHERE id = ?", [carData, id]);

  const [updatedCar] = await pool.query("SELECT * FROM cars WHERE id = ?", [
    id,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCar[0], "Car updated successfully"));
});

export const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if car exists
  const [existingCars] = await pool.query("SELECT * FROM cars WHERE id = ?", [
    id,
  ]);

  if (existingCars.length === 0) {
    throw new ApiError(404, "Car not found");
  }

  await pool.query("DELETE FROM cars WHERE id = ?", [id]);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Car deleted successfully"));
});
