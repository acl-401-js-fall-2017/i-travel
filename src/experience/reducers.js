export const EXPERIENCE_LOAD = 'EXPERIENCE_LOAD';
export const FEED_LOAD = 'FEED_LOAD';

export function experience(state=[], { type, payload }) {
  switch(type) {
    case EXPERIENCE_LOAD:
      return  [...state, payload];
    default:
      return state;
  }
}

