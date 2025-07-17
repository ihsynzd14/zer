import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type TDocumentData } from 'src/data/constants/type'
import { type TRootState } from 'src/data/stores/store'
import { type TDocumentListInit } from 'features/documentList/mapper/documentListInit.mapper'

type TInitialState = TDocumentListInit

const initialState: TInitialState = {
  documents: [],
  isSimplifiedView: false,
  isRpaFlow: false
}

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocumentList: (_state, action: PayloadAction<TDocumentListInit>) => action.payload
  }
})

export const selectDocuments = (state: TRootState): TDocumentData[] => state.documentsSlice.documents
export const selectIsSimplifiedView = (state: TRootState): boolean => state.documentsSlice.isSimplifiedView
export const selectIsRpaFlow = (state: TRootState): boolean => state.documentsSlice.isRpaFlow

export const { setDocumentList } = documentsSlice.actions

export default documentsSlice.reducer
