import { Machine, assign, send, sendParent } from 'xstate';

const levelMachine = Machine({
  id:'level',
  initial: 'initializing',
  context: {
    id: 1,
    score: 0,
    timer: 10,
    timerInterval: 1000,
  },
  states: {
    initializing: {
      on: {
        "": "playing",
      }
    },
    playing: {
      invoke:
        {
          id: 'incInterval',
          src: (context, event) => (callback, onEvent) => {
            // This will send the 'INC' event to the parent every second
            const id = setInterval(() => callback({ type: 'TIMER.UPDATE', value: -1 }), context.timerInterval);

            // Perform cleanup
            return () => clearInterval(id);
          }
        },
      on: {
        'TIMER.UPDATE': {
          actions: [
            'updateTimer',
            send('GAME.CHECK_TIME')
          ]
        },
        'SCORE.UPDATE': {
          actions: ['updateScore']
        },
        'GAME.PAUSE': 'paused',
        'GAME.END': 'endGame',
        'GAME.CHECK_TIME': { target: 'endGame', cond: ctx => ctx.timer === 0 },
      }
    },
    paused: {
      on: {
        'GAME.RESUME': {
          target: 'playing',
        },
        'GAME.RETRY': {
          target: 'initializing',
        }
      },
    },
    endGame: {
      on: {
        'GAME.RETRY': 'playing',
        'MENU.GO': {
          actions: sendParent('MENU.GO'),
        }
      },
    },
  },
},
{
  actions: {
    resetGame: assign({
      score: 0,
      timer: 10,
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

export default levelMachine;
