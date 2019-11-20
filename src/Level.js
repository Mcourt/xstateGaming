import React from 'react';

import { useService } from '@xstate/react';

const Level = ({ levelRef }) => {
  const [state, send] = useService(levelRef);
  const { context } = state;

  return (
    <div>

      {(context.timer || context.score) && (
        <div>
          <p>Timer : {context.timer} </p>
          <p>Score : {context.score}</p>
        </div>
      )}

      {state.matches('playing') && (
        <>
          <button onClick={() => send("GAME.PAUSE")}>Pause Game</button>
          <button onClick={() => send({type: "SCORE.UPDATE", value: 1})}>Add Score</button>
          <button onClick={() => send({type: "SCORE.UPDATE", value: -10})}>Remove Score</button>
          <button onClick={() => send({type: "TIMER.UPDATE", value: 10})}>Add Time</button>
          <button onClick={() => send('GAME.END')}>End Game</button>
        </>
      )}
      {state.matches('paused') && (
        <>
          <button onClick={() => send("GAME.RETRY")}>Retry</button>
          <button onClick={() => send("GAME.RESUME")}>Resume Game</button>
        </>
      )}
      {state.matches('endGame') && (
        <div>
          Final Score : {context.score}
          <button onClick={() => send("GAME.RETRY")}>Retry</button>
          <button onClick={() => send("MENU.GO")}>Go to main menu</button>
        </div>
      )}
    </div>
   );
}

export default Level;
