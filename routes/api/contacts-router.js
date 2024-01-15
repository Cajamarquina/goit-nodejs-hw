import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { contactAddSchema, contactUpdateFavoriteSchema, contactUpdateSchema } from "../../models/contacts.js";

import { isEmptyBody, isValidId, userAuthenticate } from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.use(userAuthenticate);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post("/", isEmptyBody("missing fields"), validateBody(contactAddSchema), contactsController.addContact);

contactsRouter.delete("/:contactId", isValidId, contactsController.removeContact);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody("missing fields"),
  validateBody(contactUpdateSchema),
  contactsController.updateContact
);
contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody("missing field favorite"),
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);
export default contactsRouter;