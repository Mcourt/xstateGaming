import { Machine, sendParent } from 'xstate';

const mainMenuMachine = Machine({
  id: 'main-menu',
  initial: 'initial',
  context: {
    levels: [],
  },
  states : {
    initial: {
      on: { 'LEVELS.GO': 'chooseLevel' }
    },
    chooseLevel: {
      on: {
        'MENU.GO': 'initial',
        'LEVELS.SELECT': {
          actions: sendParent((ctx, event) => event)
        },
      }
    }
  }
});

export default mainMenuMachine;
