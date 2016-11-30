export const INIT = 'INIT';
export function init() {
  return {type: INIT};
}

export const SET_USERDATA = 'SET_USERDATA';
export function setUserdata(data) {
  return {type: SET_USERDATA, data};
}

export const SET_DESCRIPTION = 'SET_DESCRIPTION';
export function setDescription(value) {
  return {type: SET_DESCRIPTION, value};
}

export const SET_FILE = 'SET_FILE';
export function setFile(value) {
  return {type: SET_FILE, value};
}


export const SUBMIT = 'SUBMIT';
