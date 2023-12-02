import { Role } from "@prisma/client";
import { Router } from "express";
import httpStatus from "http-status";

import { CreateRoomController } from "~/controllers/room/CreateRoomController";
import { DeleteRoomController } from "~/controllers/room/DeleteRoomController";
import { ListRoomsController } from "~/controllers/room/ListRoomsController";
import { UpdateRoomController } from "~/controllers/room/UpdateRoomController";
import { authorizationMiddleware } from "~/middlewares/authorizationMiddleware";
import { DatabaseRoomRepositoryStrategy } from "~/repositories/room/DatabaseRoomRepositoryStrategy";

export const roomRouter = Router();

const databaseRoomRepositoryStrategy = new DatabaseRoomRepositoryStrategy();

roomRouter.get(
  "/",
  authorizationMiddleware([Role.ADMIN, Role.STORAGE_MANAGER, Role.DOCTOR]),
  async (_, res) => {
    const rooms = await new ListRoomsController(
      databaseRoomRepositoryStrategy,
    ).listRooms();

    res.json(rooms);
  },
);

roomRouter.post(
  "/",
  authorizationMiddleware([Role.ADMIN]),
  async (req, res) => {
    const room = await new CreateRoomController(
      new DatabaseRoomRepositoryStrategy(),
    ).createRoom({
      name: req.body.name,
    });

    res.status(httpStatus.CREATED).json(room);
  },
);

roomRouter.put(
  "/:id",
  authorizationMiddleware([Role.ADMIN]),
  async (req, res) => {
    const room = await new UpdateRoomController(
      new DatabaseRoomRepositoryStrategy(),
    ).updateRoom({
      id: Number(req.params.id),
      name: req.body.name,
    });

    res.json(room);
  },
);

roomRouter.delete(
  "/:id",
  authorizationMiddleware([Role.ADMIN]),
  async (req, res) => {
    await new DeleteRoomController(
      new DatabaseRoomRepositoryStrategy(),
    ).deleteRoom({
      id: Number(req.params.id),
    });

    res.sendStatus(httpStatus.NO_CONTENT);
  },
);
