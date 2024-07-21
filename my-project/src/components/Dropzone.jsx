import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";

const MAX_LENGTH = 5;
const cssDropArea = "p-16 mt-10 border-2 border-neutral-200 rounded-xl m-4";
const cssDragActiveDropArea =
  "p-16 mt-10 border-2 border-indigo-700 rounded-xl m-4";

export default function Dropzone({
  setError,
  files,
  setFiles,
  closeModal,
  handleCrop,
  setRejectedFiles,
  rejected,
}) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Do something with the files
      if (acceptedFiles?.length) {
        setFiles((prevFiles) => {
          if (acceptedFiles?.length + (prevFiles?.length || 0) <= MAX_LENGTH) {
            return [
              ...prevFiles,
              ...acceptedFiles.map((file, index) =>
                _.assignIn(file, {
                  preview: URL.createObjectURL(file),
                  id: uuidv4(),
                  selected: false,
                  cropActive: false,
                })
              ),
            ];
          }
        });
      }
      if (rejectedFiles?.length) {
        setRejectedFiles((previousFiles) => [
          ...previousFiles,
          ...rejectedFiles.map((file) => _.assignIn(file, { id: uuidv4() })),
        ]);
      }
    },
    [files, closeModal]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 5242880,
  });

  function handleRemoveFile(id) {
    setFiles((prevFiles) => {
      return prevFiles.filter((elem) => elem.id !== id);
    });
  }

  function handleRemoveRejectedFile(name) {
    setRejectedFiles((prev) => prev.filter(({ file }) => file.name !== name));
  }

  function changeSelectedFile(selectedFileId) {
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.id === selectedFileId) {
          const fileobj = { ...file, ["selected"]: true };
          return fileobj;
        } else {
          const fileobj = { ...file, ["selected"]: false };
          return fileobj;
        }
      });
    });
  }

  async function uploadFiles(formData) {
    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "post",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    }
  }

  async function uploadMetaData(metaData) {
    try {
      const response = await fetch("http://localhost:3000/meta", {
        method: "post",
        body: JSON.stringify({ metaData: metaData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    closeModal();
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    uploadFiles(formData);
    const metaData = JSON.stringify(files);
    uploadMetaData(metaData);
  }

  function handleImageSelect(e, id) {
    changeSelectedFile(id);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {files.length < MAX_LENGTH && (
        <div
          {...getRootProps({
            className: isDragActive ? cssDragActiveDropArea : cssDropArea,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-indigo-700 pl-4">Drop the files here ...</p>
          ) : (
            <p className="text-neutral-600 pl-4">
              Drag 'n' drop some files here, or click to select files
            </p>
          )}
        </div>
      )}
      {files.length >= MAX_LENGTH && (
        <div className="m-4 rounded-xl h-28 border-2 text-center align-text-top border-neutral-200">
          <h3 className="pt-4 font-semibold text-red-500">
            You've reached the image limit
          </h3>
          <p className="p-2 text-neutral-500">
            Remove one or more to upload more images
          </p>
        </div>
      )}
      {/* preview */}
      <ul>
        {files &&
          files?.map((file, index) => (
            <li key={file.id}>
              <div className="flex justify-between items-center  m-4 rounded-xl">
                <label htmlFor={file?.id}>
                  <img
                    src={file?.preview}
                    alt={file?.name}
                    className="object-fill w-20 h-20 rounded-xl ml-4"
                  />
                </label>
                <input
                  className="mr-6"
                  value={file?.id}
                  checked={file?.selected}
                  onChange={(e) => handleImageSelect(e, file.id)}
                  type="radio"
                  id={file?.id}
                  name="file"
                />
              </div>
              <button
                className="  ml-8 mb-4 bg-white hover:bg-gray-100 font-semibold px-2 h-8 text-red-500 rounded shadow "
                onClick={() => handleRemoveFile(file.id)}
              >
                Delete
              </button>
              <button
                type="button"
                className="  ml-8 mb-4 bg-white hover:bg-gray-100 font-semibold px-2 h-8 text-neutral-700 rounded shadow "
                onClick={() => handleCrop(file.id)}
              >
                Crop
              </button>
            </li>
          ))}
      </ul>
      {/* Rejected Files */}
      <h3 className="title text-lg font-semibold text-neutral-600 mt-8 border-b pb-3 pl-4">
        Rejected Files
      </h3>
      <ul className="mt-6 flex flex-col">
        {rejected.map(({ file, errors }) => (
          <li key={file.name} className="flex items-start justify-between">
            <div>
              <p className="mt-2 text-neutral-500 text-sm pl-4 font-medium">
                {file.name}
              </p>
              <ul className="text-[12px] text-red-400 pl-4">
                {errors.map((error) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="mt-1 py-1 mr-4 text-[12px] uppercase tracking-wider font-bold text-red-400 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
              onClick={() => handleRemoveRejectedFile(file.name)}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          type="submit"
          className="m-4  bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 py-2 px-4 border border-gray-400 rounded shadow"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
