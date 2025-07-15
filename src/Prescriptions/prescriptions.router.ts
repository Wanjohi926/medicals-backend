import { Express } from 'express';
import { createPrescriptionController, getPrescriptionsController, getPrescriptionByIdController, updatePrescriptionController, deletePrescriptionController } from './prescriptions.controller';

const prescriptions = (app: Express) => {
    
  // Create a prescription
  app.route('/prescription').post(async (req, res, next) => {
    try {
      await createPrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all prescriptions
  app.route('/prescriptions').get(async (req, res, next) => {
    try {
      await getPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get and update prescription by ID
  app.route('/prescription/:id')
    .get(async (req, res, next) => {
      try {
        await getPrescriptionByIdController(req, res);
      } catch (error) {
        next(error);
      }
    })
    .put(async (req, res, next) => {
      try {
        await updatePrescriptionController(req, res);
      } catch (error) {
        next(error);
      }
    })
    .delete(async (req, res, next) => {
      try {
        await deletePrescriptionController(req, res);
      } catch (error) {
        next(error);
      }
    });
};

export default prescriptions;
