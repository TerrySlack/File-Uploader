import { RefCallback, useEffect, useRef } from "react";

import { useFileUploader } from "../../hooks/useFileUploader";
import { IFileUpload } from "../../types/types";

export const FileUpload = ({ cacheId }: IFileUpload) => {
  const { onInputChange, onDragOver, onDrop, onDragEnter, onDragLeave } = useFileUploader({ cacheId });

  const fileInputRef = useRef<HTMLInputElement | null>();

  const refCallback: RefCallback<HTMLInputElement> = (ref) => {
    fileInputRef.current = ref;
  };
  const dropZoneButtonClickRef = useRef(() => {
    fileInputRef?.current?.click();
  });

  useEffect(() => {
    const preventDefault = (event: DragEvent) => {
      event.preventDefault();
    };

    document.addEventListener("dragover", preventDefault);
    document.addEventListener("drop", preventDefault);

    return () => {
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("drop", preventDefault);
    };
  }, []);
  return (
    <div className="p-4 border border-gray-300 rounded-md shadow-md" draggable={false}>
      <button
        className="dropzone border-dashed border-2 border-silver-600 p-4 rounded-md text-center cursor-pointer bg-inherit  hover:border-yellow-400 text-white font-bold py-2 px-4"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onClick={dropZoneButtonClickRef.current}
        draggable
      >
        <p className="text-silver-600">Drag &apos;n&apos; drop some files here, or click to select files</p>
      </button>

      <input
        ref={refCallback}
        id="fileInput"
        type="file"
        className="hidden"
        onChange={onInputChange}
        accept=".png, .jpg, .jpeg, .pdf, .svg, image/svg+xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
      />
    </div>
  );
};
