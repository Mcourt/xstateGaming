import { Machine, assign, send, sendParent } from 'xstate';

const playerMachine = new Machine({
  id: 'player',
  initial: 'running',
  states: {
    running: {
      on: {
        'JUMP': 'jumping',
      },
    },
    jumping: {
      on: {
        'LAND': 'running'
      }
    },
  },
  on: {
    'SCORE.UPDATE': {
      actions: () => console.log('update')
    }
  }
});

export default playerMachine;
