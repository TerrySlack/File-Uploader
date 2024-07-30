import { ChangeEvent, DragEvent } from "react";

export interface FileSelectorProps {
  inputId?: string;
  messageParagraph?: string;
  inputClassName?: string;
  clickableAreaClassName?: string;
  dropZoneWrapperClassName?: string;
  messageParagraphClassName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void;
  onDrop: (e: DragEvent<HTMLButtonElement>) => void;
  onDragEnter: (e: DragEvent<HTMLButtonElement>) => void;
  onDragLeave: (e: DragEvent<HTMLButtonElement>) => void;
}

//Incoming Props
export interface IFileUploaderProps {
  maximumUploadCount?: number;
  maximumFileSize?: number;
  acceptedTypes?: Record<string, string>;
}

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
