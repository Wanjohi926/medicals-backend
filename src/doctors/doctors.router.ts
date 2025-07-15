import { Express } from "express";
import { createDoctorController, getDoctorController, getDoctorByIdController, updateDoctorController, deleteDoctorController, loginDoctorController, verifyDoctorController } from "./doctors.controller";

const doctor = (app: Express) => {
  // Create doctor
  app.route('/doctor').post(async (req, res, next) => {
    try {
      await createDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //verify doctor
app.route("/doctor/verify").post(
  async (req, res, next) => {
    try {
      await verifyDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  }
);

    // login route
    app.route("/doctor/login").post(
        async (req, res, next) => {
            try {
                await loginDoctorController(req, res)
            } catch (error) {
                next()
            }
        }

    )


    // Get all doctors
    app.route('/doctors').get(async (req, res, next) => {
      try {
        await getDoctorController(req, res);
      } catch (error) {
        next(error);
      }
    });
  
    // Get doctor by ID
    app.route('/doctor/:id').get(async (req, res, next) => {
      try {
        await getDoctorByIdController(req, res);
      } catch (error) {
        next(error);
      }
    });
  
    // Update doctors
    app.route('/doctor/:id').put(async (req, res, next) => {
      try {
        await updateDoctorController(req, res);
      } catch (error) {
        next(error);
      }
    });
  
    // Delete doctor by ID
    app.route('/doctor/:id').delete(async (req, res, next) => {
      try {
        await deleteDoctorController(req, res);
      } catch (error) {
        next(error);
      }
    });
  
};
export default doctor;