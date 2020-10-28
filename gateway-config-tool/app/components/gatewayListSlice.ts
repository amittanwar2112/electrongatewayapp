import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../store';

const gatewayListSlice = createSlice({
  name: 'gatewayList',
  initialState: { value: [] },
  reducers: {
    clearGatewayList: (state) => {
        state.value = [];
    },
    appendGateway: (state, action) => {
        let newList = [...state.value];
        newList.push(action.payload as never);
        console.log(newList);
        state.value = newList;
    }
  },
});


export const { clearGatewayList, appendGateway } = gatewayListSlice.actions;


export default gatewayListSlice.reducer;

export const selectGatewayList = (state: RootState) => state.gatewayList.value;
