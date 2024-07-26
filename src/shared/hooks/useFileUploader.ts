import { ChangeEvent, DragEvent, useCallback, useEffect, useState } from "react";

import {
  defaultTypeExtensions,
  SvgXmlnsAttributeCheck,
  checkFilesMaximumSize,
  maximumFileSize as maxFileSize,
  isValidFileType,
  printableMaximumFileSize,
  checkFile,
} from "../utils/processUploadedFiles";

import { IStore, IFileUploaderProps, IFileUploaderHook, FileData } from "./types";

import { createObservable } from "../utils/Observables";
import { useCustomCallback } from "./useCustomCallback";

const store: IStore = {};
export const useFileUploader = ({
  cacheId,
  maximumUploadCount,
  maximumFileSize = maxFileSize,
  acceptedTypes = defaultTypeExtensions,
}: IFileUploaderProps): IFileUploaderHook => {
  //Update the hook when needed
  const [, setUpdateTrigger] = useState<number>(0);

  //This is used to trigger a rerender once, the files have been added to the observable
  const setState = useCustomCallback(() => {
    setUpdateTrigger((state) => state + 1);
  }, []);

  const setMaximumUploadsExceeded = useCallback(
    (status = false, fileCount?: number, maximumUploads?: number) => {
      const { maxUploadError } = store[cacheId];
      maxUploadError.status = status;
      maxUploadError.message = status
        ? `You have attempted to upload ${fileCount} files.  The maximum allowable uploads for this feature is ${maximumUploads}`
        : "";
      setState();
    },
    [cacheId, store],
  );
  const setMaximumFileSizeExceeded = useCallback(
    (status = false) => {
      const { maxFileSizeError } = store[cacheId];
      maxFileSizeError.status = status;
      maxFileSizeError.message = status
        ? `You have attempted upload a file(s) that exceeds the maximum size of ${printableMaximumFileSize}`
        : "";
      setState();
    },
    [cacheId, store],
  );

  const processFiles = useCustomCallback(
    (files: File[]) => {
      const { maximumUploadCount, maxUploadError, maximumFileSize, maxFileSizeError } = store[cacheId];
      const maxFileSizeCheck = checkFilesMaximumSize(files, maximumFileSize) && !maxFileSizeError.status;

      const maxUploadCountCheck =
        typeof maximumUploadCount !== "undefined" ? !maxUploadError.status && files.length > maximumUploadCount : false;

      //Check to ensure the maximum file size has not been exceeded
      if (maxFileSizeCheck || maxUploadCountCheck) {
        //Do the separate checks now
        if (maxFileSizeCheck)
          //Update something for the toast maximumFileSize
          setMaximumFileSizeExceeded(true);

        if (maxUploadCountCheck) setMaximumUploadsExceeded(true, files.length, maximumUploadCount);

        //reset the observables
        onCancel();
      } else {
        const { valid, invalid } = files.reduce(
          (acc, file: File) => {
            if (isValidFileType(file, acceptedTypes))
              acc.valid.push(SvgXmlnsAttributeCheck(file, defaultTypeExtensions));
            else acc.invalid.push(file);
            return acc;
          },
          { valid: [] as Promise<FileData>[], invalid: [] as File[] },
        );

        const { validFiles, invalidFiles } = store[cacheId];
        if (valid.length > 0) {
          Promise.all(valid).then((results) => {
            validFiles.next(results);
          });
        }

        if (invalid.length > 0) {
          invalidFiles.next(invalid);
        }
      }
    },
    [
      cacheId,
      store,
      SvgXmlnsAttributeCheck,
      checkFilesMaximumSize,
      setMaximumFileSizeExceeded,
      setMaximumUploadsExceeded,
    ],
  );

  const onInputChange = useCustomCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      processFiles(files);
    },
    [processFiles],
  );

  const onRemoveFile = useCallback(
    (index: number) => {
      const { validFiles } = store[cacheId];
      const updatedValidFiles = validFiles.getState().filter((_: FileData, i: number) => i !== index);
      validFiles.next(updatedValidFiles);
    },
    [store, cacheId],
  );

  const onIdChange = useCallback(
    (index: number, id: string) => {
      const { validFiles } = store[cacheId];

      const updatedValidFiles = validFiles.getState().map((fileData: FileData, i: number) => {
        if (i === index) {
          //Create a new File with the new Id
          const renamedFile = checkFile(id, fileData.file);
          return { ...fileData, file: renamedFile, id };
        }
        return fileData;
      });
      validFiles.next(updatedValidFiles);
    },
    [store, cacheId, checkFile],
  );

  const onDrop = useCustomCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles],
  );

  const onDragOver = useCustomCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDragEnter = useCustomCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { classList } = e.currentTarget;
    classList.add("border-yellow-400");
    classList.remove("border-silver-600");
  }, []);

  const onDragLeave = useCustomCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentTarget = e.currentTarget;

    const timeoutId = setTimeout(() => {
      if (currentTarget && !currentTarget.contains(e.relatedTarget as Node)) {
        const { classList } = currentTarget;
        classList.remove("border-yellow-400");
        classList.add("border-silver-600");
      }
      clearTimeout(timeoutId);
    }, 200);
  }, []);

  const onCancel = useCallback(() => {
    const { validFiles, invalidFiles } = store[cacheId];
    validFiles.next([]);
    invalidFiles.next([]);
    setState();
  }, [store, cacheId]);

  const clearCache = useCallback(
    (cacheId: string | number) => {
      delete store[cacheId];
    },
    [store],
  );

  const getFilesOnly = useCallback(() => {
    const { validFiles } = store[cacheId];
    return validFiles?.getState().map(({ file }: FileData) => file);
  }, [store, cacheId]);

  //Subcribe to the observable
  useEffect(() => {
    if (!Boolean(cacheId) || !Boolean(maximumUploadCount)) return undefined;

    const subject = store[cacheId];
    //Check to see if the observable is in the store.  If not, add it
    if (!Boolean(subject) && Boolean(maximumUploadCount)) {
      store[cacheId] = {
        maximumUploadCount,
        maximumFileSize,
        maxUploadError: {
          status: false,
          message: "",
        },
        maxFileSizeError: {
          status: false,
          message: "",
        },
        validFiles: createObservable<FileData[]>([]),
        invalidFiles: createObservable<File[]>([]),
      };
    }

    const { validFiles, invalidFiles } = store[cacheId];
    const validFilesUnsubscribe = validFiles.subscribe(setState);
    const invalidFilesUnsubscribe = invalidFiles.subscribe(setState);
    return () => {
      validFilesUnsubscribe();
      invalidFilesUnsubscribe();
    };
  }, []);

  return {
    validFiles: store[cacheId]?.validFiles?.getState() ?? [],
    invalidFiles: store[cacheId]?.invalidFiles?.getState() ?? [],
    onInputChange,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    onIdChange,
    onRemoveFile,
    onCancel,
    maximumUploadsExceeded: store[cacheId]?.maxUploadError,
    maximumFileSizeExceeded: store[cacheId]?.maxFileSizeError,
    setMaximumUploadsExceeded,
    setMaximumFileSizeExceeded,
    processFiles,
    clearCache,
    getFilesOnly,
  };
};
