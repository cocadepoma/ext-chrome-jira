import { UIState } from '.';

export type AuthActionType =
  | { type: 'Auth - Logout' }
  | { type: 'Auth - Login', payload: UIState }

export const authReducer = (state: UIState, action: AuthActionType): UIState => {
  switch (action.type) {
    case 'Auth - Logout':
      return {
        ...state,
        email: null,
        userId: null,
      };

    case 'Auth - Login':
      return {
        ...state,
        email: action.payload.email,
        userId: action.payload.userId,
        token: action.payload.token,
      };

    default:
      return state;
  }
};