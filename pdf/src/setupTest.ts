import { ERROR_NAMES, ErrorView, TAttribute } from '@dxs/coreenablers-fe-common-library';
import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import  React from 'react'

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const mockEnvResult = {
  env: 'test',
  country: 'TEST',
  basePath: '/test'
};

const descTest = {desc: 'This is a document description' } 

type TAttributes = {
  NAME: string,
  DOCUMENT_DESCRIPTION: string,
  TILE_NAME: string,
  DOCUMENT_TYPE: string
  STORAGE_TYPE: string
}

type TStorageType = {
  LONG_TERM: string
}

type TMimeType = {
  PDF: string
}

type TChioskChannel = {
  CHANNELS: string[]
}



jest.mock('@dxs/coreenablers-fe-common-library', () => ({
  COMMON_CONFIG: class COMMON_CONFIG {
    // Aggiungi qui eventuali metodi o proprietà necessari
    static ATTRIBUTES: TAttributes = {
      NAME: 'Document Name',
      DOCUMENT_DESCRIPTION: 'docDesc',
      TILE_NAME: 'TILE_NAME',
      DOCUMENT_TYPE: 'PDF',
      STORAGE_TYPE: 'LONG_TERM'
      
    }
    static STORAGE_TYPE: TStorageType = {
      LONG_TERM: 'LONG_TERM'
    }
    static MIME_TYPE: TMimeType ={
      PDF: "pdf"
    }
    static CHIOSK_CHANNELS:TChioskChannel = {
      CHANNELS: ['58', '87']
    }
    },
  COMMON_ROUTES: class {
  },
  COMMON_ENDPOINT_NAMES: class {
  },
  getEnvironment: jest.fn(() => mockEnvResult),
  isNotBlankEmpty: jest.fn((value) => value !== null && value !== undefined && value !== ''),
  selectSessionParams: jest.fn(),
  getDocTitleAndDesc: jest.fn(() => descTest),
  getAttributeValueWithMatchNameAndContext: jest.fn(() =>  'Document Name'),
  getAttributeValue: jest.fn((attributes: TAttribute[], singleAttribute)=> attributes.find((x) => x.name === singleAttribute)?.value),
  getAttributeValueFromContext: jest.fn(()=> "stored123"),
  generateKey: jest.fn(() => Math.random() * 1000),
  createBlobFromBase64Content: jest.fn(),
  useSendPostMessage: jest.fn(),
  isInWorkflow: jest.fn(() => true),
  isNullOrUndefined: jest.fn((value) => value === null || value === undefined),
  isBlankEmpty: jest.fn((value) => value === null || value === undefined || value === ''),
  useSendCallback: jest.fn(() => {sendCallback: jest.fn()}),
  useWorkflowInstances: jest.fn(),
  getLabel: jest.fn((value) => value),
  useFetchPdfPreviewData: jest.fn(),
  newError: jest.fn(),
  setSessionParams: jest.fn((value) => value),
  sleep: jest.fn(),
  getDynatraceActionName: jest.fn()
}));

export const getEnvironment = jest.fn(() => mockEnvResult);

jest.mock(
  '@ial/ial-security-library',
  () => {
    return (obj: any) => {
      return { loadModule: () => null, object: obj }
    }
  },
  
  { virtual: true }
)

jest.mock('@omn/react-ark-library', () => ({
  Dynatrace: {
    enterCustomAction: jest.fn(),
    leaveCustomAction: jest.fn(),
    createCustomAction: jest.fn(),
  }
}));