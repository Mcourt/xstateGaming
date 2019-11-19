import { Machine, assign, send } from 'xstate';
import playerMachine from './playerMachine';

const inGameStates = {
  initial: 'playing',
  states: {
    playing: {
      invoke: [
        {
          id: 'player',
          src: playerMachine,
        },
        {
          id: 'incInterval',
          src: (context, event) => (callback, onEvent) => {
            // This will send the 'INC' event to the parent every second
            const id = setInterval(() => callback({ type: 'TIMER.UPDATE', value: -1 }), 1000);

            // Perform cleanup
            return () => clearInterval(id);
          }
        }
      ],
      on: {
        'TIMER.UPDATE': {
          actions: [
            'updateTimer',
            send('GAME.END')
          ]
        },
        'SCORE.UPDATE': {
          actions: ['updateScore']
        },
        'GAME.PAUSE': 'paused',
      }
    },
    paused: {
      on: {
        'GAME.RESUME': {
          target: 'playing',
        },
        'GAME.RETRY': {
          target: 'playing',
          actions: ['resetGame']
        }
      },
    },
  }
};

const gameMachine = Machine({
  id: 'game',
  initial: 'mainMenu',
  context: {
    score: 0,
    timer: 10,
  },
  states: {
    mainMenu: {
      on: { 'GAME.NEW': 'inGame' },
    },
    inGame: {
      on: {
        'GAME.END': { target: 'endGame', cond: ctx => ctx.timer === 0 },
      },
      ...inGameStates,
    },
    endGame: {
      on: {
        'GAME.RETRY': 'inGame',
        'MENU.GO': 'mainMenu',
      },
      exit: ['resetGame']
    },
  }
},
  {
    actions: {
      resetGame: assign({
        score: () => gameMachine.initialState.context.score,
        timer: () => gameMachine.initialState.context.timer,
      }),
      updateScore: assign({
        score: (ctx, event) => {
          const newScore = ctx.score + event.value;
          return newScore > 0 ? newScore : 0;
        }
      }),
      updateTimer: assign({
        timer: (ctx, { value }) => {
          const newTimer = ctx.timer + value;
          return newTimer > 0 ? newTimer : 0;
        }
      })
    }
  });

export default gameMachine;
