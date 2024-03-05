import { createSlice } from "@reduxjs/toolkit";

const listGroupSlice = createSlice({
  name: "listGroup",
  initialState: {
    listGroup: [],
  },
  reducers: {
    setListGroup: (state, action) => {
      state.listGroup = action.payload;
    },
    addGroup: (state, action) => {
      state.listGroup = [action.payload, ...state.listGroup];
    },
    outGroup: (state, action) => {
      const { index } = action.payload;
      const updatedList = state.listGroup.filter(obj => obj.id !== index);
      state.listGroup = updatedList;
    },
    editGroup: (state, action) => {
      const { index, dataUpdate } = action.payload;
      const updatedList = state.listGroup.map((group) =>
        group.id === index ? { ...group, ...dataUpdate } : group
      );
      state.listGroup = updatedList;
    },
  },
});

export const { setListGroup, addGroup, editGroup, outGroup } = listGroupSlice.actions;
export default listGroupSlice.reducer;
