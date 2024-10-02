import React, { useEffect, useState, ReactNode, ReactElement, Children, useRef } from 'react';

interface UIWrapperProps {
  canvas: ReactNode;
  children: ReactNode;
}

// @TODO: Find out how to use the game canvas provided instead.
export const UIWrapper: React.FC<UIWrapperProps> = ({ canvas, children }) => {
  const [scaleFactor, setScaleFactor] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let width: number | null, height: number | null, canvasId: string | null = null;
  if (canvasRef.current) {
    width = canvasRef.current.width;
    height = canvasRef.current.height;
    canvasId = canvasRef.current.id;
  }

  // <UIWrapper canvas={props.children}>
  //   <UIElement x={35} y={375}>
  //     <button style={{zIndex: 24}}>Click me!</button>
  //   </UIElement>
  //   <UIElement x={840} y={130}>
  //     <div style={{ maxWidth: '7ch' }}>Another element</div>
  //   </UIElement>
  // </UIWrapper>

  // Monitor canvas size and adjust scale factor for UI elements
  useEffect(() => {
    const canvasElement = document.getElementById(canvasId ?? '') as HTMLCanvasElement;
    const handleResize = () => {
      if (canvasElement) {
        const { width: currWidth, height: currHeight } = canvasElement.getBoundingClientRect();
        setScaleFactor(Math.min(currWidth / (width ?? 800), currHeight / (height ?? 600)));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial scaling on component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Canvas for game */}
      <div id="canvas-container" style={{ position: 'absolute', top: 0, left: 0 }}>
        {React.cloneElement(canvas as ReactElement, { ref: canvasRef })}
      </div>

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
  x: number;
  y: number;
  children: ReactNode;
}

export const UIElement: React.FC<UIElementProps> = ({ x, y, children }) => {
  return (
    <div
      style={{
        position: 'relative',
        top: `${y}px`,
        left: `${x}px`,
        // transform: 'translate(-50%, -50%)', // Adjust to center based on x, y
      }}
    >
      {children}
    </div>
  );
};