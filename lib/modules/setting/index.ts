import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE_CODE } from '@utilities/constant';

export interface ISetting {
  locale: LANGUAGE_CODE;
}
export const DomainListHintPostfix = '-DomainListHint';
export const DepositListHintPostfix = '-DepositListHint';
export const PromoPopHint = 'PromoPopHint';

const initialState: ISetting = {
  locale: LANGUAGE_CODE.VIETNAM,
};

const settingSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload as LANGUAGE_CODE;
    },
  },
});

const { actions, reducer } = settingSlice;
export const SettingActions = actions;
export const settingReducer = reducer;
