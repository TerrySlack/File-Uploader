### A React package, that allows for the selection of files, through drag and drop or the File Dialog api. Re-rendering is kept to a minimum, helping with application performance

### Installation:

npm i @mainframework/dropzone
yarn @mainframework/dropzone

### Configuration and properties

`Hook config properties`
{
maximumUploadCount:5, //Defaults to 30
maximumFileSize = maxFileSize, //Defaults to 5 mb's
acceptedTypes = defaultTypeExtensions, //See the default extensions above
}

`Hook - returned properties`

```JS | TS
{
    //Properties
    validFiles,  //These are the valid files selected
    invalidFiles,  //The invalid files a user attempted to select

    //Methods
    clearCache,  // This will clear out the valid and invalid files
    getValidFileStreams,  //This will provde the actual File | Blobs that are within the valid Files
    onCancel, //This will call clearCache
    onIdChange, //Use this, if you want to change the name of a File.
    onRemoveFile,  //Remove a file from the valid files array
    setMaximumFileSizeExceeded,  //Use this for any errors generated, regarding the maximum file size
    setMaximumUploadsExceeded,  //Use this for any errors generated regarding the maximum number of uploads

    //Component - Export the FileSelector:  Use this ready made comopnent.
    FileSelector: () => (
      <FileSelector
       inputId={"SomeID"}  //Optional
       messageParagraph={"A message to display in the dropzone"} //Optional - Defaults to "Drag 'n' drop some files here, or click to select files"
       inputClassName={"some css classes"} //Optional - You can add your own css.  The default is hidden, a tailwindcss class
       clickableAreaClassName={"some css classes"} //Optional - You can add your own css.  The default is composed of some tailwindclasses.  It's either or.
       dropZoneWrapperClassName={"some css classes"} //Optional - You can add your own css.  The default is composed of some tailwindclasses.  It's either or.
       messageParagraphClassName={"some css classes"} //Optional - You can add your own css.   The default is composed of some tailwindclasses.  It's either or.
       onChange={onInputChange}
       onDragOver={onDragOver}
       onDrop={onDrop}
       onDragEnter={onDragEnter}
       onDragLeave={onDragLeave}
      />
    ),
  }
```

```JS | TS
//Here are the default upload types the pacakge will handle.  You can send in your own, so long as it's in the following format.
export const defaultTypeExtensions: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/jpg": ".jpg",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
```

### Hook configuration

```JS | TS
//Here you can set the following properties for the FileSelector.  These are all optional
 const { validFiles, onIdChange, onCancel, onRemoveFile, FileSelector } = useFileSelector({
  acceptTypes: ".png" //Defaults to ".png, .jpg, .jpeg, .pdf, .svg, image/svg+xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  maximumUploadCount:5,  //Defaults to 30
  maximumFileSize = 5e6,  //Defaults to 5 mb's
  acceptedTypes = defaultTypeExtensions,  //See the default extensions above
});

```

### Usage

### App.tsx

Once the package is installed, import the hook

```JS | TS
import { useFileSelector } from "@mainframework/dropzone";

export const App = ()=>{
  //Note:  You can set the following props for the hook  maximumUploadCount, maximumFileSize, acceptedTypes
   const { validFiles, onIdChange, onCancel, onRemoveFile, FileSelector } = useFileSelector();

const onSelect = () => {
    if (Array.isArray(validFiles)) {
      //This will be used to select the files.  Won't be used here
    }
  };

  return (
    <>
      <FileSelector />   {/*This is the component that will display the dropzone*/}

      {validFiles.length > 0 && (
        <PreviewImages  //<---PreviewImages is a component where you render the images.  It's up to you to provide this functionality
          validFiles={validFiles}
          onChange={onIdChange}
          onSelect={onSelect}
          onCancel={onCancel}
          onRemoveFile={onRemoveFile}
        />
      )}
    </>
  );
}
```
