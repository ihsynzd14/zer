# PDF Preview Project - Architecture Documentation

## Project Overview

This PDF Preview application serves as a reference implementation for building React applications with Redux state management, custom hooks, and API integration using the `@dxs/coreenablers-fe-common-library`. The project follows specific patterns that should be replicated in new projects.

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/           # Reusable UI components
├── features/            # Feature-based modules
│   ├── documentList/    # Document listing feature
│   │   ├── components/  # Feature-specific components
│   │   ├── slices/      # Redux slice for this feature
│   │   └── mapper/      # Data transformation logic
│   └── pdfpreview/      # PDF preview feature
├── hooks/               # Custom hooks
├── pages/               # Page-level components
├── data/
│   ├── stores/          # Redux store configuration
│   ├── routes/          # Routing configuration
│   └── constants/       # Application constants
└── utils/               # Utility functions
```

### Key Dependencies

```json
{
  "@dxs/coreenablers-fe-common-library": "^1.0.458",
  "@reduxjs/toolkit": "^1.9.7",
  "react-redux": "^8.1.3",
  "react-router-dom": "^6.2.1"
}
```

## 🔄 Data Flow Architecture

```
Initialization → API Call → Mapper → Redux Store → Components
     ↓              ↓         ↓          ↓           ↓
RootRoute → useInitializeApp → toMapper → setDocumentList → selectDocuments
```

## 📡 API Integration Pattern

### Using coreenablers-fe-common-library

The project uses the common library for all API interactions:

```typescript
// Example from useFetchDocPreview.ts
import { useFetchPdfPreviewData } from '@dxs/coreenablers-fe-common-library'

export function useFetchPreview({ ...commonApiOptions }: TUseFetchPreviewProps = {}) {
  const { fetchPdfPreviewByStoreId } = useFetchPdfPreviewData(commonApiOptions)
  const sessionParams = useAppSelector(selectSessionParams)

  async function fetchDocument({ storeId, storageType }: TDocPreviewProps) {
    const result = await fetchPdfPreviewByStoreId({
      storeId,
      storageType,
      callerCode: sessionParams.callerCode,
      bankCode: sessionParams.bankCode
    })
    return result
  }

  return { fetchDocument }
}
```

### Custom Hook Pattern

1. **Wrap Common Library Hooks**: Create custom hooks that wrap the common library API hooks
2. **Add Business Logic**: Include retry logic, error handling, and data transformation
3. **Return Simple Interface**: Provide easy-to-use functions for components

## 🗃️ Redux State Management

### Store Configuration

```typescript
// src/data/stores/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { commonSlice } from '@dxs/coreenablers-fe-common-library'
import documentsSlice from 'src/features/documentList/slices/DocumentsSlice'

const rootReducer = combineReducers({
  common: commonSlice,
  documentsSlice
})

const store = configureStore({
  reducer: rootReducer
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch
```

### Typed Redux Hooks

```typescript
// src/data/stores/hooks.ts
export const useAppDispatch: () => TAppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector
```

### Feature Slice Pattern

Each feature has its own Redux slice:

```typescript
// src/features/documentList/slices/DocumentsSlice.ts
export const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
    isSimplifiedView: false,
    isRpaFlow: false
  },
  reducers: {
    setDocumentList: (_state, action: PayloadAction<TDocumentListInit>) => action.payload
  }
})

// Selectors
export const selectDocuments = (state: TRootState): TDocumentData[] => state.documentsSlice.documents
export const selectIsRpaFlow = (state: TRootState): boolean => state.documentsSlice.isRpaFlow

// Actions
export const { setDocumentList } = documentsSlice.actions
```

## 🔄 Data Transformation (Mapper Pattern)

### Mapper Function

```typescript
// src/features/documentList/mapper/documentListInit.mapper.ts
export function extractDocumentData(document: TDocumentDetailResponse): TDocumentData {
  const { attributes, id: documentId, status, code, storeId: documentStoreId } = document
  
  const name = getAttributeValue(attributes, CONFIG.ATTRIBUTES.NAME) as string
  const tileName = getAttributeValue(attributes, CONFIG.ATTRIBUTES.TILE_NAME) as string
  const storageType = getAttributeValue(attributes, CONFIG.ATTRIBUTES.STORAGE_TYPE) as string
  
  return {
    documentId,
    storeId,
    status,
    code,
    name,
    tileName,
    description: desc as string,
    storageType
  }
}

export default function toDocumentListInitMapper(
  dossierDetailsData: TDossierDetailResponse
): TDocumentListInit | undefined {
  const documents = dossierDetailsData.documentGroups[0]?.documents?.map(extractDocumentData)
  return { 
    documents, 
    isSimplifiedView: false, 
    isRpaFlow: false 
  }
}
```

## 🚀 Initialization Pattern

### App Initialization Hook

```typescript
// src/hooks/useInitializeApp.ts
export function useInitializeApp(): () => void {
  const dispatch = useAppDispatch()
  const { fetchDossierDetailsWithRetryForType } = useFetchDossierDetails({
    dossierType: 'UCX'
  })

  return useCallback(() => {
    void (async () => {
      // 1. Fetch data from API
      const dossierDetailsData = await fetchDossierDetailsWithRetryForType()
      
      // 2. Transform data using mapper
      const documentListInit = toDocumentListInitMapper(dossierDetailsData)
      
      // 3. Store in Redux
      dispatch(setDocumentList(documentListInit))
      
      // 4. Navigate based on data
      initializeNavigation(dossierDetailsData.documentGroups[0]?.documents)
    })()
  }, [])
}
```

## 📋 Key Patterns for New Project Implementation

### 1. Task Management Hook (like useFetchDocPreview)

For your new project with `getTask`, follow this pattern:

```typescript
// hooks/useFetchTasks.ts
import { useApiCall } from '@dxs/coreenablers-fe-common-library'

export function useFetchTasks() {
  const { fetchTasks } = useApiCall() // From common library
  const sessionParams = useAppSelector(selectSessionParams)

  async function getTask(taskId: string) {
    const result = await fetchTasks({
      taskId,
      // Add required session parameters
      callerCode: sessionParams.callerCode,
      bankCode: sessionParams.bankCode
    })
    return result
  }

  return { getTask }
}
```

### 2. Task Slice (Redux)

```typescript
// features/tasks/slices/TasksSlice.ts
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    }
  }
})

export const selectTasks = (state: TRootState) => state.tasksSlice.tasks
export const { setTasks, addTask } = tasksSlice.actions
```

### 3. One-to-One Mapping Pattern

```typescript
// mapper/taskDocumentMapper.ts
export function mapTaskToDocument(task: TTaskResponse): TTaskDocument {
  return {
    taskId: task.id,
    documentId: task.documentId, // One-to-one mapping
    title: task.title,
    status: task.status,
    // ... other mappings
  }
}
```

### 4. Single Fetch & Store Pattern

```typescript
// hooks/useInitializeTasks.ts
export function useInitializeTasks() {
  const dispatch = useAppDispatch()
  const { getTask } = useFetchTasks()
  
  return useCallback(async () => {
    // Fetch once and store in Redux
    const tasks = await getTask()
    const mappedTasks = tasks.map(mapTaskToDocument)
    dispatch(setTasks(mappedTasks))
  }, [])
}
```

### 5. Testing Upload Functionality

Create a test page to verify Redux persistence:

```typescript
// pages/testUpload/TestUploadPage.tsx
export default function TestUploadPage() {
  const navigate = useNavigate()
  const tasks = useAppSelector(selectTasks)
  
  const simulateUpload = () => {
    // Add new task to Redux
    dispatch(addTask(newTask))
    
    // Navigate away and back to test persistence
    navigate('/other-page')
  }
  
  return (
    <div>
      <h2>Test Upload - Tasks: {tasks.length}</h2>
      <button onClick={simulateUpload}>Simulate Upload</button>
      <button onClick={() => navigate('/tasks')}>Back to Tasks</button>
    </div>
  )
}
```

## 🔄 Component Usage Pattern

### Consuming Redux Data

```typescript
// components/TaskList.tsx
export default function TaskList() {
  const tasks = useAppSelector(selectTasks)
  const { getTask } = useFetchTasks()
  
  // Data is already in Redux, no need to refetch
  useEffect(() => {
    // Only fetch if Redux is empty
    if (tasks.length === 0) {
      // Initialize app will handle this
    }
  }, [])
  
  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.taskId} task={task} />
      ))}
    </div>
  )
}
```

## 🎯 Implementation Checklist for New Project

### ✅ Setup Phase
- [ ] Install required dependencies (`@reduxjs/toolkit`, `react-redux`)
- [ ] Configure Redux store with common library slice
- [ ] Set up typed Redux hooks
- [ ] Create directory structure following feature-based organization

### ✅ Feature Development
- [ ] Create feature slice for tasks (`features/tasks/slices/TasksSlice.ts`)
- [ ] Implement mapper for API response transformation
- [ ] Create custom hook wrapping `useApiCall` from common library
- [ ] Implement one-to-one task-document mapping

### ✅ Integration
- [ ] Create initialization hook (`useInitializeTasks`)
- [ ] Implement single fetch and store pattern
- [ ] Add error handling and validation
- [ ] Create test upload page for Redux persistence verification

### ✅ Testing
- [ ] Verify data persists in Redux after navigation
- [ ] Test upload simulation and Redux updates
- [ ] Ensure no unnecessary API refetching

## 🔧 Best Practices

1. **Single Source of Truth**: All data lives in Redux, components just consume
2. **Fetch Once**: Initialize data once and rely on Redux for subsequent access
3. **Feature Isolation**: Each feature has its own slice, components, and hooks
4. **Type Safety**: Use TypeScript throughout with proper typing
5. **Error Handling**: Implement consistent error handling in hooks and mappers
6. **Testing**: Create test pages for upload scenarios and Redux persistence

## 📚 Key Files to Reference

- **Hook Pattern**: `src/hooks/useFetchDocPreview.ts`
- **Redux Slice**: `src/features/documentList/slices/DocumentsSlice.ts`
- **Mapper Pattern**: `src/features/documentList/mapper/documentListInit.mapper.ts`
- **Initialization**: `src/hooks/useInitializeApp.ts`
- **Store Setup**: `src/data/stores/store.ts`
- **Component Usage**: `src/pages/pdfPreview/PdfPreviewPage.tsx`

This architecture ensures clean separation of concerns, type safety, and efficient data management with Redux as the single source of truth. 
