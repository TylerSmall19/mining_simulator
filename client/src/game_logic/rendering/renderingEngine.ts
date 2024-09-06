import { Actor, CollisionType, Color } from "excalibur";
import { gameScript } from "../gameScript";
import { renderingUtils } from "./utils/renderingUtils";

const renderPaddle = () => {
  // Create an actor with x position of 150px,
  // y position of 40px from the bottom of the screen,
  // width of 200px and a height of 20px
  const paddle = new Actor({
    x: gameScript.getGameEngine().drawWidth / 2 - 12.5,
    y: gameScript.getGameEngine().drawHeight - 40,
    width: 25,
    height: 25,
    // Let's give it some color with one of the predefined
    // color constants
    color: Color.Chartreuse,
  });

  // Make sure the paddle can participate in collisions, by default excalibur actors do not collide with each other
  // CollisionType.Fixed is like an object with infinite mass, and cannot be moved, but does participate in collision.
  paddle.body.collisionType = CollisionType.Fixed;

  // Add a mouse move listener
  gameScript.getGameEngine().input.pointers.primary.on("down", (evt) => {
    renderingUtils.moveActor(paddle, evt.coordinates.worldPos, 100);
  });

  // `game.add` is the same as calling
  // `game.currentScene.add`
  gameScript.getGameEngine().add(paddle);
};

const startGame = () => {
  renderPaddle();
};

export const renderingEngine = {
  startGame
};