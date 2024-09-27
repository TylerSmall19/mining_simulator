import * as express from 'express';
import { ROUTE_CONSTANTS } from '../routeConstants';
import { PlayerUserDetailsRepo } from '../repositories/PlayerUserDetailsRepo';
import { Logger } from '../logger/Logger';

const playerRouter: express.Router = express.Router();

export type CreatePlayerParams = {
  playerName: string
}

const createPlayer = async (req: express.Request, res: express.Response) => {
  const { playerName } = req.body;
  const playerRepo = new PlayerUserDetailsRepo();
  try {
    const createdPlayer = await playerRepo.createNewPlayer({ playerName })
    if (createdPlayer) {
      res
        .status(201)
        .json(createdPlayer);
    }
  } catch (e) {
    const msg = 'Unable to add player'
    Logger.error(msg, e);
    res
      .status(422)
      .send(msg);
  }
}

playerRouter.post(ROUTE_CONSTANTS.playerCreate, createPlayer);

export { playerRouter }