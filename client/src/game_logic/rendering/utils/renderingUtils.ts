import { lightBlue } from "@mui/material/colors";
import { Actor, Color, Vector } from "excalibur";

const moveActor = (actor: Actor, moveToPosition: Vector, actorSpeed: number) => {
  const cursorActorName = 'moveCursor';
  // clear movement actions
  actor.actions.clearActions();
  // clear all cursor actors
  actor.scene?.actors.every((actor) => {
    if(actor.name === cursorActorName)
      actor.kill();
    return true;
  });
  const moveCursor = new Actor({
    color: Color.fromHex(lightBlue[50]),
    height: 5,
    width: 5,
    x: moveToPosition.x,
    y: moveToPosition.y,
    name: cursorActorName
  });
  moveCursor.actions.blink(500, 500);
  actor.scene?.add(moveCursor);
  actor.actions.moveTo(moveToPosition, actorSpeed).toPromise().then(() => {
    moveCursor.kill();
  });
}

export const renderingUtils = {
  moveActor
}