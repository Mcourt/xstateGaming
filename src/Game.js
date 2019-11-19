import React from 'react';
import { useMachine } from '@xstate/react';
import gameMachine from './machines/gameMachine';

const Game = () => {
  const [current, send] = useMachine(gameMachine.withContext({ ...gameMachine.context, timer: 120 }));
  const { context } = current;
  return (
    <div>
      <h1>Current state = {JSON.stringify(current.value)}</h1>
      <div>
        <h2>State controller</h2>
        {current.matches('mainMenu') && (
          <>
            <button onClick={() => send("GAME.NEW")}>New Game</button>
          </>
        )}
        {current.matches('inGame') && (
          <>
            <div>
              <p>Timer : {context.timer} </p>
              <p>Score : {context.score}</p>
            </div>
            {current.matches('inGame.playing') && (
              <>
                <button onClick={() => send("GAME.PAUSE")}>Pause Game</button>
                <button onClick={() => send({type: "SCORE.UPDATE", value: 1})}>Add Score</button>
                <button onClick={() => send({type: "SCORE.UPDATE", value: -10})}>Remove Score</button>
                <button onClick={() => send({type: "TIMER.UPDATE", value: 10})}>Add Time</button>
              </>
            )}
            {current.matches('inGame.paused') && (
              <>
                <button onClick={() => send("GAME.RETRY")}>Retry</button>
                <button onClick={() => send("GAME.RESUME")}>Resume Game</button>
              </>
            )}
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
