/**
 * This file contains the dispatch and selector hook functions for the React-Redux library.
 */

import { type TAppDispatch, type TRootState } from './store'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

/**
 * Hook for accessing the Redux dispatch function.
 */
export const useAppDispatch: () => TAppDispatch = useDispatch

/**
 * Hook for accessing the Redux state.
 */
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector
