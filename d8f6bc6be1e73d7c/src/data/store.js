import {createStore} from 'redux';
import * as actions from './actions';

export const initial = {
  meta: {
    email: '',
    fullName: '',
    phoneNumber: '',
    country: '',
    typeWixUser: false,
    typeCCMember: false,
    description: ''
  },
  file: null
};

function app(previousState, action) {
  const state = Object.assign({}, previousState);

  switch (action.type) {
    case actions.SET_USERDATA:
      Object.assign(state, {meta: action.data});
      break;

    case actions.SET_DESCRIPTION:
      state.meta.description = action.value;
      break;

    case actions.SET_FILE:
      state.file = action.value;
      break;

    default:
      break;
  }
  return state;
}

const store = createStore(app, initial);
store.subscribe(() => console.log('store updated:', store.getState()));

export default store;
export {actions};
