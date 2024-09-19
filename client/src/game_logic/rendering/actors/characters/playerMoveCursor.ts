import { lightBlue } from "@mui/material/colors";
import { Actor, ActorArgs, Color } from "excalibur";

export class PlayerMoveCursor extends Actor {
  static cursorKey: string = 'move_cursor'
  /**
   *
   */
  constructor(options?: ActorArgs) {
    super({
      height: 5,
      width: 5,
      color: Color.fromHex(lightBlue[300]),
      name: PlayerMoveCursor.cursorKey,
      ...options
    });

    this.actions.blink(500, 500);
  }
}