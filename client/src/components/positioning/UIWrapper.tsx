import React, { useEffect, useState, ReactNode, ReactElement, Children } from 'react';
import { gameScript } from '../../game_logic';
import { APP_CONFIG } from '../../shared/constants/config_consts';

interface UIWrapperProps {
  children: ReactNode;
}

/** This will wrap its children and bind them to the game's UI. It will be within the window and will resize when the
 * window resizes
 */
export const UIWrapper: React.FC<UIWrapperProps> = ({ children }) => {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [positionState, setPositionState] = useState({
    x: 0,
    y: 0,
    height: APP_CONFIG.gameHeight,
    width: APP_CONFIG.gameWidth
  });

  // Monitor canvas size and adjust scale factor for UI elements
  useEffect(() => {
    const handleResize = () => {
      const canvasElement = gameScript.getGameEngine().canvas;

      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect()
        if (
          rect.x !== positionState.x 
          || rect.y !== positionState.y
          || rect.height !== positionState.height
          || rect.width !== positionState.width
        ) {
          setPositionState({
            ...positionState,
            x: rect.x,
            y: rect.y,
            height: rect.height,
            width: rect.width
          })
        }
      }

      if (canvasElement) {
        const { width: currWidth, height: currHeight } = canvasElement.getBoundingClientRect();
        setScaleFactor(Math.min(currWidth / APP_CONFIG.gameWidth, currHeight / APP_CONFIG.gameHeight));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial scaling on component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [positionState]);

  if (!gameScript.getGameEngine().isRunning())
    return null;

  return (
    <div style={{
      position: 'absolute',
      left: positionState.x,
      top: positionState.y,
      width: positionState.width + 'px',
      height: positionState.height + 'px',
      pointerEvents: 'none'
    }}>

      {/* Iterate over children and apply absolute positioning individually */}
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement, {
            style: {
              ...(child.props as any).style,
              position: 'absolute', // Ensure each child is absolutely positioned
              transform: `scale(${scaleFactor})`,
            },
          });
        }
        return child;
      })}
    </div>
  );
};

interface UIElementProps {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  children: ReactNode;
  canInteract?: boolean
}

export const UIElement: React.FC<UIElementProps> = ({ children, canInteract, top, bottom, right, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
        zIndex: canInteract ? 5 : 2,
        pointerEvents: canInteract ? 'auto' : 'none',
        display: 'inline'
      }}
    >
      {children}
    </div>
  );
};