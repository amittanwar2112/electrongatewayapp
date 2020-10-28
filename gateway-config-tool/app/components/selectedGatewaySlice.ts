import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../store';

const selectedGatewaySlice = createSlice({
  name: 'gatewayList',
  initialState: { value: null },
  reducers: {
    clearGateway: (state) => {
        state.value = null;
    },
    setGateway: (state, action) => {
        state.value = action.payload;
    }
  },
});


export const { clearGateway, setGateway } = selectedGatewaySlice.actions;


export default selectedGatewaySlice.reducer;

export const selectGateway = (state: RootState) => state.selectedGateway.value;
