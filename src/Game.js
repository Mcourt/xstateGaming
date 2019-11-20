import React from 'react';
import { useMachine } from '@xstate/react';
import gameMachine from './machines/gameMachine';

import levels from './levels';

import MainMenu from './MainMenu';
import Level from './Level';


const Game = () => {
  const [current, send] = useMachine(gameMachine.withContext({ levels }));

  const { context } = current;

  return (
    <div>
        {current.matches('mainMenu') && (
          <MainMenu menuRef={context.mainMenu} otherProp="couocu" />
        )}

        {current.matches('inGame') && (
          <Level levelRef={context.currentLevel} />
        )}
    </div>
  );
}

export default Game;
