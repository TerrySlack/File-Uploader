import { ChangeEvent, DragEvent } from "react";
import { IObservable } from "../utils/Observables";

export interface FileData {
  id: string;
  file: File | Blob;
  url: string;
  type: string;
}

export interface ErrorMessage {
  status: boolean;
  message: string;
}

export type IFileUploaderHook = {
  validFiles: FileData[];
  invalidFiles: File[];
  maximumUploadsExceeded: ErrorMessage;
  maximumFileSizeExceeded: ErrorMessage;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void;
  onDrop: (e: DragEvent<HTMLButtonElement>) => void;
  onDragEnter: (e: DragEvent<HTMLButtonElement>) => void;
  onDragLeave: (e: DragEvent<HTMLButtonElement>) => void;
  onIdChange: (index: number, id: string) => void;
  onRemoveFile: (index: number) => void;
  onCancel: () => void;
  processFiles: (file: File[]) => void;
  clearCache: (cacheId: string | number) => void;
  getFilesOnly: () => (File | Blob)[];
  setMaximumUploadsExceeded: (status?: boolean) => void;
  setMaximumFileSizeExceeded: (status?: boolean) => void;
};

export interface IFileUploaderProps {
  cacheId: string | number;
  maximumUploadCount?: number;
  maximumFileSize?: number;
  acceptedTypes?: Record<string, string>;
}

export interface IStoreEntry {
  maximumUploadCount: number | undefined;
  maximumFileSize: number;
  maxUploadError: ErrorMessage;
  maxFileSizeError: ErrorMessage;
  validFiles: IObservable<FileData[]>;
  invalidFiles: IObservable<File[]>;
}

export interface IStore {
  [cacheName: string | number]: IStoreEntry;
}

export interface IFileUpload {
  cacheId: string;
}
