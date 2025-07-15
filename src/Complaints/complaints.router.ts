import { Express } from 'express';
import {
  createComplaintController,
  getComplaintsController,
  getComplaintByIdController,
  updateComplaintController,
  deleteComplaintController
} from './complaints.controller';

const complaint = (app: Express) => {
  // Create complaint
  app.route('/complaint').post(async (req, res, next) => {
    try {
      await createComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all complaints
  app.route('/complaints').get(async (req, res, next) => {
    try {
      await getComplaintsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get complaint by ID
  app.route('/complaint/:id').get(async (req, res, next) => {
    try {
      await getComplaintByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update complaint by ID
  app.route('/complaint/:id').put(async (req, res, next) => {
    try {
      await updateComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete complaint by ID
  app.route('/complaint/:id').delete(async (req, res, next) => {
    try {
      await deleteComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default complaint;
