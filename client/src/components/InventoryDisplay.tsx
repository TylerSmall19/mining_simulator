import { Grid2, Tooltip } from '@mui/material';
import { MineableMineralTypes } from '../game_logic/rendering/actors/resources/mining/types/MineableMineralTypes';
import { ResourceFetcher } from '../game_logic/rendering/actors/resources/utils/resourceFetcher';
import { APIImageSource } from '../game_logic/rendering/image_classes/APIImageSource';
import { useEffect, useState } from 'react';
import { InventoryShape } from '../game_logic/inventory/PlayerInventoryTypes';
import { UIElement, UIWrapper } from './positioning/UIWrapper';

const InventoryItem = ({imageSource, itemCount, itemKey}: { imageSource: string, itemCount: number, itemKey: string }) => (
  <Grid2 key={itemKey} size='grow'>
    <div>
      <Tooltip title={itemKey}>
        <div>
          <span>{itemCount}</span>
          <img src={imageSource} height='42px' width='42px' alt={`inventory item ${itemKey}`} />
        </div>
      </Tooltip>
    </div>
  </Grid2>
);

export const InventoryDisplay = (props: { inventory: InventoryShape, itemCount: number }) => {
  const [showInventory, setShowInventory] = useState(false);

  useEffect(() => {
    setShowInventory(props.itemCount > 0)
  }, [props.itemCount])

  if (showInventory)
    return (
    <UIWrapper>
      <UIElement left={0} top={50}>
        <h3>Inventory:</h3>
        <Grid2 container={true}>
          {Object.keys((props.inventory?.ores || {})).map((invKey) => {
            const itemKey: MineableMineralTypes = invKey as MineableMineralTypes;
            const imagePath = (ResourceFetcher.fetchByKeys([invKey])![0] as APIImageSource)?.path
            if (imagePath)
              return (
                <InventoryItem
                  imageSource={imagePath}
                  itemCount={(props.inventory?.ores || {})[itemKey]}
                  itemKey={invKey}
                  key={invKey}
                />
              );
            return null;
          })}
        </Grid2>
      </UIElement>
    </UIWrapper>);

  return (<></>);
}