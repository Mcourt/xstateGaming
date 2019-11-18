import React from 'react';
import { useMachine } from '@xstate/react';
import gameMachine from './machines/gameMachine';

const Game = () => {
  const [current, send] = useMachine(gameMachine);
  const { context } = current;
  return (
    <div>
      <h1>Current state = {current.value}</h1>
      <div>
        <h2>State controller</h2>
        {current.matches('mainMenu') && (
          <>
            <button onClick={() => send("GAME.NEW")}>New Game</button>
          </>
        )}
        {current.matches('playing') && (
          <>
            <div>
              <p>Timer : {context.timer} </p>
              <p>Score : {context.score}</p>
            </div>
            <button onClick={() => send("GAME.PAUSE")}>Pause Game</button>
            <button onClick={() => send({type: "SCORE.ADD", value: 5})}>Add Score</button>
            <button onClick={() => send({type: "SCORE.ADD", value: -10})}>Remove Score</button>
          </>
        )}
        {current.matches('paused') && (
          <>
            <button onClick={() => send("GAME.RETRY")}>Retry</button>
            <button onClick={() => send("GAME.RESUME")}>Resume Game</button>
          </>
        )}
        {current.matches('endGame') && (
          <div>
            Final Score : {context.score}
            <button onClick={() => send("GAME.RETRY")}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
