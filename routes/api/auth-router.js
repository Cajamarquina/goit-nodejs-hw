import express from "express";
import authController from "../../controllers/auth-controller.js";
import { isEmptyBody, userAuthenticate, upload } from "../../middlewares/index.js";
import { validateBody, validateAvatar } from "../../decorators/index.js";
import {
  userLoginSchema,
  userRegisterSchema,
  updateSubscriptionSchema,
  avatarUploadSchema,
} from "../../models/user.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody("missing fields"), validateBody(userRegisterSchema), authController.register);
authRouter.post("/login", isEmptyBody("missing fields"), validateBody(userLoginSchema), authController.login);
authRouter.get("/current", userAuthenticate, authController.getCurrent);
authRouter.post("/logout", userAuthenticate, authController.logout);
authRouter.patch("/", userAuthenticate, validateBody(updateSubscriptionSchema), authController.subscription);
authRouter.patch(
  "/avatars",
  userAuthenticate,
  upload.single("avatar"),
  validateAvatar(avatarUploadSchema),
  authController.updateAvatar
);
export default authRouter;