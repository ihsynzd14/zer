import { combineReducers, configureStore, type Store } from '@reduxjs/toolkit'
import { commonSlice } from '@dxs/coreenablers-fe-common-library'
import documentsSlice from 'src/features/documentList/slices/DocumentsSlice'

/**
 * Root reducer that combines all the slices
 */
const rootReducer = combineReducers({
  common: commonSlice,
  documentsSlice
})

/**
 * The configureStore function is used to create a Redux store that uses the rootReducer as its reducer.
 */
const store: Store = configureStore({
  reducer: rootReducer
})

/**
 * The RootState type is a TypeScript type that represents the root state of the application, which is the combined state of all reducers.
 */
export type TRootState = ReturnType<typeof store.getState>

/**
 * The AppDispatch type is a TypeScript type that represents the dispatch function of the Redux store,
 * which can be used to dispatch actions to update the state of the application.
 */
export type TAppDispatch = typeof store.dispatch

export default store
