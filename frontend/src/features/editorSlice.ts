import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  code: string;
  roomId: string | null;
}

const initialState: EditorState = {
  code: "# Start coding here...",
  roomId: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
  },
});

export const { setCode, setRoomId } = editorSlice.actions;
export default editorSlice.reducer;
