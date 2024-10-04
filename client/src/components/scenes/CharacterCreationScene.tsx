import { Scene, SceneActivationContext } from 'excalibur';
import { GameEngine } from '../../game_logic/resources/custom_classes/GameEngine';
import { APIImageSource } from '../../game_logic/rendering/image_classes/APIImageSource';
import { Box, Grid2 } from '@mui/material';
import { APP_CONFIG } from '../../shared/constants/config_consts';
import { CharacterCarousel } from '../menu/CharacterCarousel';

export class CharacterCreationScene extends Scene {
  characterSkins: APIImageSource[] | null = null;
  onInitialize(engine: GameEngine): void {

  }

  /** Data can be passed to a scene during activation via the goToScene('sceneKey', { some: 'data' })
   * 
   * ```public onActivate(ctx: SceneActivationContext<MyLevelData>) {
   * const { spawnLocation } = ctx.data;
   * console.log(spawnLocation);
   * if (ctx.previousScene instanceof Level) {
   *  this.startButton.text = 'Resume game';
   * } else {
   *   this.startButton.text = 'Start game';
   * }
   * }```
   * 
   */
  onActivate(context: SceneActivationContext<unknown>): void {
    
  }
};

export const CharacterCreationComponent = () => {
  return (
    <Box component='div' sx={{
      maxWidth: APP_CONFIG.gameWidth, 
      maxHeight: APP_CONFIG.gameHeight 
    }}>
      <Grid2 container>
        <Grid2 >
          <CharacterCarousel />
        </Grid2>
      </Grid2>
      <p>This is the character creation scene!</p>
    </Box>
  );
};