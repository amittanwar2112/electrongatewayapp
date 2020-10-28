import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../store';

const userSlice = createSlice({
  name: 'gatewayList',
  initialState: { value: null },
  reducers: {
    clearUser: (state) => {
        state.value = null;
    },
    setUser: (state, action) => {
        state.value = action.payload;
    }
  },
});


export const { clearUser, setUser } = userSlice.actions;


export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.value;
