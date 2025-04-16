import { createSlice } from "@reduxjs/toolkit";

const unseenSlice = createSlice({
  name: "unseen",
  initialState: 0,
  reducers: {
    setUnseen: (state, action) => {
      return action.payload;
    },
  },
});

export const { setUnseen } = unseenSlice.actions;
export default unseenSlice.reducer;
