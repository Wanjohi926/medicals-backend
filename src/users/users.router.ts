import { Express } from "express";
import {
  createUserController,
  verifyUserController,
  loginUserController,
  getUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from "./users.controller";

const user = (app: Express) => {
  app.route('/user').post(async (req, res, next) => {
    try {
      await createUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/user/verify").post(async (req, res, next) => {
    try {
      await verifyUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/user/login").post(async (req, res, next) => {
    try {
      await loginUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route('/users').get(async (req, res, next) => {
    try {
      await getUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route('/user/:id')
    .get(async (req, res, next) => {
      try {
        await getUserByIdController(req, res);
      } catch (error) {
        next(error);
      }
    })
    .put(async (req, res, next) => {
      try {
        await updateUserController(req, res);
      } catch (error) {
        next(error);
      }
    })
    .delete(async (req, res, next) => {
      try {
        await deleteUserController(req, res);
      } catch (error) {
        next(error);
      }
    });
};

export default user;
