//Use this to quickly get the file extensions
//TODO:  This needs to be updatable by a dev, programmatically.
export const defaultTypeExtensions: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/jpg": ".jpg",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

//This is the attribute that should be present in all svg files
const xmlns = "<svg xmlns='http://www.w3.org/2000/svg' ";
export const maximumUploadCount = 30;
export const maximumFileSize = 5e6; //5 mb's
export const printableMaximumFileSize = "5 Megabytes";

export const isValidFileType = (file: File, acceptedTypes = defaultTypeExtensions) => Boolean(acceptedTypes[file.type]);

export const hasSurpassedMaxSize = (file: File | Blob, maxSize = maximumFileSize) => file.size > maxSize;

export const checkFilesMaximumSize = (files: (File | Blob)[], maxFileSize = maximumFileSize) =>
  files.every((file) => hasSurpassedMaxSize(file, maxFileSize));

export const createUrlString = (file: File) => URL.createObjectURL(file);
export const clearBlobFromMemory = (url: string) => {
  URL.revokeObjectURL(url);
};

const createDocumentData = (file: File, allowableTypes = defaultTypeExtensions) => ({
  id: file.name.split(".")[0],
  type: allowableTypes[file.type],
  file,
  url: createUrlString(file),
});

export const SvgXmlnsAttributeCheck = async (file: File, allowableTypes = defaultTypeExtensions) => {
  if (file.type !== "image/svg+xml") return createDocumentData(file, allowableTypes);

  //Get the text representation of the file
  const text = await file.text();
  if (text.includes("xmlns")) return createDocumentData(file, allowableTypes);

  //Missng the xmlns attribute, add it
  const svgWithXmlns = text.replace("<svg ", xmlns);

  return createDocumentData(
    new File([svgWithXmlns], file.name, {
      type: file.type,
    }),
    allowableTypes,
  );
};

export const renameFile = (file: File | Blob, newName: string): File =>
  new File([file], `${newName}`, { type: file.type });

export const checkFile = (id: string, file: File | Blob): File | Blob => {
  //Blobs don't have a name, so we need to convert it to a file, then we can rename it
  if (file instanceof Blob) {
    return id.length > 0 ? renameFile(file as File | Blob, id) : (file as Blob);
  }

  //It's a file, let's process it.
  if (id.length === 0 || id.toLocaleLowerCase() === (file as File).name.toLocaleLowerCase().split(".")[0]) {
    return file as File;
  }
  return renameFile(file as File | Blob, id);
};
