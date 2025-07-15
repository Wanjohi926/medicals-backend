import { Express } from 'express';
import {
  createAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController
} from './Appointments.controller';

const appointment = (app: Express) => {

  // Post new appointment
  app.route('/appointment').post(async (req, res, next) => {
    try {
      await createAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all appointments
  app.route('/appointments').get(async (req, res, next) => {
    try {
      await getAllAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get one appointment
  app.route('/appointment/:id').get(async (req, res, next) => {
    try {
      await getAppointmentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update existing appointments
  app.route('/appointment/:id').put(async (req, res, next) => {
    try {
      await updateAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete apointment
  app.route('/appointment/:id').delete(async (req, res, next) => {
    try {
      await deleteAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default appointment;
