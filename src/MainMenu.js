import React from 'react';

import { useService } from "@xstate/react";

const MainMenu = ({ menuRef }) => {
  const [state, send] = useService(menuRef);

  return (
    <div>
      {state.matches('initial') && (
        <button onClick={() => send('LEVELS.GO')}>Choose levels</button>
      )}
      {state.matches('chooseLevel') && (
        <ul>
          {state.context.levels.map((level) => (
            <li key={level.id}>
              <button onClick={() => send({ type: 'LEVELS.SELECT', levelId: level.id})}>
                Level {level.id} : {level.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MainMenu;
