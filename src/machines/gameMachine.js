import { Machine, assign, spawn } from 'xstate';

import levels from '../levels';

import mainMenuMachine from './mainMenuMachine';
import levelMachine from './levelMachine';

const gameMachine = Machine({
  id: 'game',
  initial: 'mainMenu',
  context: {
    levels: [],
    currentLevel: null,
    mainMenu: null,
  },
  states: {
    mainMenu: {
      entry: assign({
        mainMenu: (ctx) => spawn(mainMenuMachine.withContext({ levels: ctx.levels }))
      }),
      on: {
        'LEVELS.SELECT': 'inGame',
      }
    },
    inGame: {
      entry: assign({
        currentLevel: (ctx, event) => {
          const selectedLevel = levels.find((level) => level.id === event.levelId);
          return spawn(levelMachine.withContext(
            {
              ...levelMachine.initialState.context,
              ...selectedLevel
            },
          ));
        },
        on: {
          'MENU.GO': 'mainMenu',
        }
      })
    },
  }
});

export default gameMachine;
