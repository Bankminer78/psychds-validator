// deno-lint-ignore-file no-explicit-any
import { ValidatorOptions } from '../setup/options.js'
import { psychDSFile } from './file.js';

export interface ContextDataset {
  dataset_description: Record<string, unknown>
  files: any[]
  tree: object
  ignored: any[]
  metadataFile: psychDSFile
  options?: ValidatorOptions
}
export interface Context {
  dataset: ContextDataset
  path: string
  baseDir: string
  datatype: string
  keywords: Record<string, string>,
  extension: string
  suffix: string
  sidecar: object
  validColumns: object
  suggestedColumns: string[]
  metadataProvenance: Record<string,psychDSFile>
  json: object
  
}