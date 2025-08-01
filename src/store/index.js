import { configureStore } from '@reduxjs/toolkit';
// import your reducers here
// import userReducer from './userSlice';
// import postReducer from './postSlice';

const store = configureStore({
  reducer: {
    // user: userReducer,
    // posts: postReducer,
  },
});

export default store;
