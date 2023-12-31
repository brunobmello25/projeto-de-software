import { Role } from "@prisma/client";
import { Router } from "express";
import httpStatus from "http-status";
import { AddProductToStorageController } from "~/controllers/storage/AddProductToStorageController";
import { DeleteProductFromStorageController } from "~/controllers/storage/DeleteProductFromStorageController";

import { ListProductsOnStorageController } from "~/controllers/storage/ListProductsOnStorageController";
import { UpdateProductQuantityOnStorageController } from "~/controllers/storage/UpdateProductQuantityOnStorageController";
import { authorizationMiddleware } from "~/middlewares/authorizationMiddleware";
import { DatabaseStorageRepositoryStrategy } from "~/repositories/storage/DatabaseStorageRepositoryStrategy";

export const storageRouter = Router();

storageRouter.use(authorizationMiddleware([Role.STORAGE_MANAGER]));

storageRouter.get("/", async (_, res) => {
  const storage = await new ListProductsOnStorageController(
    new DatabaseStorageRepositoryStrategy(),
  ).listProductsOnStorage();

  res.json(storage);
});

storageRouter.post("/", async (req, res) => {
  const room = await new AddProductToStorageController(
    new DatabaseStorageRepositoryStrategy(),
  ).addProductToStorage({
    productId: Number(req.body.productId),
    quantity: Number(req.body.quantity),
  });

  res.status(httpStatus.CREATED).json(room);
});

// TODO: nao deveria receber o productId no path, e sim no body -> id no path geralmente é referente ao recurso que estamos editando
storageRouter.put("/:productId", async (req, res) => {
  const room = await new UpdateProductQuantityOnStorageController(
    new DatabaseStorageRepositoryStrategy(),
  ).updateProductQuantityOnStorage({
    productId: Number(req.params.productId),
    quantity: Number(req.body.quantity),
  });

  res.json(room);
});

storageRouter.delete("/:productId", async (req, res) => {
  await new DeleteProductFromStorageController(
    new DatabaseStorageRepositoryStrategy(),
  ).deleteProductFromStorage({
    productId: Number(req.params.productId),
  });

  res.sendStatus(httpStatus.NO_CONTENT);
});
