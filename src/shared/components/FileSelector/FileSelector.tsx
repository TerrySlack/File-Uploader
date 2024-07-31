import { RefCallback, useEffect, useRef, MouseEvent } from "react";
import { FileSelectorProps } from "../../types/types";

import "./tailwind.css";
export const FileSelector = ({
  inputId,
  messageParagraph,
  inputClassName,
  clickableAreaClassName,
  dropZoneWrapperClassName,
  messageParagraphClassName,
  onChange,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
}: FileSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const refCallback: RefCallback<HTMLInputElement> = (ref) => {
    fileInputRef.current = ref;
  };
  const dropZoneButtonClickRef = useRef((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  });

  //Css classes
  const inputClassesRef = useRef<string>(`hidden ${inputClassName ?? ""}`);

  const clickableAreaClassNameRef = useRef<string>(
    `${clickableAreaClassName ?? "dropzone border-dashed border-2 border-silver-600 p-4 rounded-md text-center cursor-pointer bg-inherit  hover:border-yellow-400 text-white font-bold py-2 px-4"}`,
  );

  const dropZoneWrapperClassNameRef = useRef<string>(
    `${dropZoneWrapperClassName ?? "p-4 border border-gray-300 rounded-md shadow-md"}`,
  );

  const messageParagraphClassNameRef = useRef<string>(`${messageParagraphClassName ?? "text-silver-600"}`);

  const messageParagraphRef = useRef<string>(
    `${messageParagraph ?? "Drag 'n' drop some files here, or click to select files"}`,
  );

  useEffect(() => {
    //Wire up the drag and drop
    const preventDefault = (event: DragEvent) => {
      event.preventDefault();
    };

    document.addEventListener("dragover", preventDefault);
    document.addEventListener("drop", preventDefault);

    return () => {
      //Clean up
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("drop", preventDefault);
    };
  }, []);
  return (
    <div className={dropZoneWrapperClassNameRef.current} draggable={false}>
      <button
        type="button"
        className={clickableAreaClassNameRef.current}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onClick={dropZoneButtonClickRef.current}
        draggable
      >
        <p className={messageParagraphClassNameRef.current}>{messageParagraphRef.current}</p>
      </button>

      <input
        ref={refCallback}
        id={inputId}
        type="file"
        className={inputClassesRef.current}
        onChange={onChange}
        accept=".png, .jpg, .jpeg, .pdf, .svg, image/svg+xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
      />
    </div>
  );
};
