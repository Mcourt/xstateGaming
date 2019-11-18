import { Machine, assign, send } from 'xstate';

const gameMachine = Machine({
  id: "game",
  initial: "mainMenu",
  context: {
    score: 0,
    timer: 5,
  },
  states: {
    mainMenu: {
      on: { 'GAME.NEW': 'playing' },
    },
    playing: {
      invoke: {
        id: 'incInterval',
        src: (context, event) => (callback, onEvent) => {
          // This will send the 'INC' event to the parent every second
          const id = setInterval(() => callback('TIMER.DEC'), 1000);

          // Perform cleanup
          return () => clearInterval(id);
        }
      },
      on: {
        'GAME.END': { target: "endGame", cond: ctx => ctx.timer === 0 },
        'GAME.PAUSE': 'paused',
        'TIMER.DEC': {
          actions: [
            assign({
              timer: (ctx, event) => {
                const newTimer = ctx.timer - 1;
                return newTimer > 0 ? newTimer : 0;
              }
            }),
            send('GAME.END')
          ]
        },
        'SCORE.ADD': {
          actions: assign({
            score: (ctx, event) => {
              const newScore = ctx.score + event.value;
              return newScore > 0 ? newScore : 0;
            }
          })
        },
      },
    },
    paused: {
      on: {
        'GAME.RESUME': {
          target: 'playing',
        },
        'GAME.RETRY': {
          target: 'playing',
          actions: assign({
            score: 0,
            timer: (context, event) => 120,
          })
        }
      },
    },
    endGame: {
      on: { 'GAME.RETRY': 'playing' },
    },
  }
});

export default gameMachine;
