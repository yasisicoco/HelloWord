import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedKidId: null,
};

const kidSlice = createSlice({
  name: 'kid',
  initialState,
  reducers: {
    setSelectedKid: (state, action) => {
      state.selectedKidId = action.payload;
    },
    clearSelectedKid: (state) => {
      state.selectedKidId = null;
    },
  },
});

export const { setSelectedKid, clearSelectedKid } = kidSlice.actions;
export default kidSlice.reducer;
