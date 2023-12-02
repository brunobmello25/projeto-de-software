import { Router } from "express";
import httpStatus from "http-status";

import { ListProductsController } from "~/controllers/product/ListProductsController";
import { CreateProductController } from "~/controllers/product/CreateProductController";
import { DeleteProductController } from "~/controllers/product/DeleteProductController";
import { UpdateProductController } from "~/controllers/product/UpdateProductController";
import { DatabaseProductRepositoryStrategy } from "~/repositories/product/DatabaseProductRepositoryStrategy";
import { authorizationMiddleware } from "~/middlewares/authorizationMiddleware";
import { Role } from "@prisma/client";

export const productRouter = Router();

productRouter.use();

productRouter.get(
  "/",
  authorizationMiddleware([Role.STORAGE_MANAGER, Role.DOCTOR]),
  async (_, res) => {
    const products = await new ListProductsController(
      new DatabaseProductRepositoryStrategy(),
    ).listProducts();

    res.json(products);
  },
);

productRouter.post(
  "/",
  authorizationMiddleware([Role.STORAGE_MANAGER]),
  async (req, res) => {
    const product = await new CreateProductController(
      new DatabaseProductRepositoryStrategy(),
    ).createProduct({
      name: req.body.name,
    });

    res.status(httpStatus.CREATED).json(product);
  },
);

productRouter.put(
  "/:id",
  authorizationMiddleware([Role.STORAGE_MANAGER]),
  async (req, res) => {
    const product = await new UpdateProductController(
      new DatabaseProductRepositoryStrategy(),
    ).updateProduct({
      id: Number(req.params.id),
      name: req.body.name,
    });

    res.json(product);
  },
);

productRouter.delete(
  "/:id",
  authorizationMiddleware([Role.STORAGE_MANAGER]),
  async (req, res) => {
    await new DeleteProductController(
      new DatabaseProductRepositoryStrategy(),
    ).deleteProduct({
      id: Number(req.params.id),
    });

    res.sendStatus(httpStatus.NO_CONTENT);
  },
);
