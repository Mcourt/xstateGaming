import level1 from './1';
import level2 from './2';

export default [
  {
    id: 1,
    name: "It's really easy",
    ...level1,
  }, {
    id: 2,
    name: "Still not that hard",
    ...level2,
  }
]
