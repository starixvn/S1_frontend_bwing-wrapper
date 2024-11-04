import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalAction } from 'lib/types/common';

export interface Alert {
  title?: string;
  message: string;
  onDismiss?: Function;
  actions?: ModalAction[];
  isDismissed?: Boolean;
  persistent?: boolean;
  hideCloseButton?: boolean;
}

interface AlertState {
  data: Alert[];
}

const initialState: AlertState = {
  data: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.data.push(action.payload);
    },
    addInfo: (state, action: PayloadAction<string | Alert>) => {
      state.data.push(resolvePayloadToAlert(action.payload));
    },
    addError: (state, action: PayloadAction<string | Alert>) => {
      state.data.push(resolvePayloadToAlert(action.payload, 'status.error'));
    },
    addSuccess: (state, action: PayloadAction<string | Alert>) => {
      state.data.push(resolvePayloadToAlert(action.payload, 'status.success'));
    },
    dismiss: state => {
      if (state.data.length > 0) {
        state.data[0].isDismissed = true;
      }
    },
    next: state => {
      if (state.data.length > 0) {
        state.data.splice(0, 1);
      }
    },
    // setActionLoading: (
    //   state,
    //   action: PayloadAction<{ loading: AlertAction['loading']; index: number }>,
    // ) => {
    //   if (state.data.length > 0 && state.data[0].actions?.length) {
    //     state.data[0].actions[action.payload.index].loading =
    //       action.payload.loading;
    //   }
    // },
  },
  extraReducers: {
    LOGOUT: () => {
      return initialState;
    },
  },
});

function resolvePayloadToAlert(payload: string | Alert, title?: string): Alert {
  if (typeof payload === 'string') {
    return {
      title,
      message: payload as string,
    };
  } else {
    return payload as Alert;
  }
}

const { reducer, actions } = alertSlice;
export const AlertActions = actions;
export const alertReducer = reducer;
