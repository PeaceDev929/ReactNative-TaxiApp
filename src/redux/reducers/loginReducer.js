/* Login Reducer
 * handles login states in the app
 */
import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
   isLoggedIn: false,
   id: 0,
   username: '',
   password: '',
};

export const loginReducer = createReducer(initialState, {
   [types.LOGIN_REQUEST](state, action) {
      return {
         ...state,
         username: action.username,
         password: action.password,
      };
   },
   [types.LOGIN_LOADING_ENDED](state) {
      return { ...state };
   },
   [types.LOGIN_RESPONSE](state, action) {
      return {
         ...state,
         id: action.response.id,
         isLoggedIn: true,
      };
   },
   [types.LOGIN_FAILED](state) {
      return {
         ...state,
         isLoggedIn: false,
      };
   },
   [types.LOG_OUT](state) {
      return {
         ...state,
         isLoggedIn: false,
      };
   },
});
