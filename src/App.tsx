import React from 'react';
import './App.css';
import { GameWindow } from './components/GameWindow';
import { gameScript } from './game_logic/gameScript';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameWindow>
          <canvas id={gameScript.canvasId}></canvas>
        </GameWindow>
      </header>
    </div>
  );
}

export default App;
