import { useState, useCallback } from "react";

import Modal from "../UI/Modal";
import Dropzone from "./Dropzone";
import CropperComponent from "./CropperComponent";

const MAX_LENGTH = 5;

export default function Profile({}) {
  const [files, setFiles] = useState([]);
  const [rejected, setRejectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showCropWindow, setShowCropWindow] = useState(false);

  function handleUpdatePicture() {
    setIsUpdate(true);
  }

  function handleCrop(selectedFileId) {
    setShowCropWindow(true);
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.id === selectedFileId) {
          const fileobj = { ...file, ["cropActive"]: true };
          return fileobj;
        } else {
          const fileobj = { ...file, ["cropActive"]: false };
          return fileobj;
        }
      });
    });
  }

  function handleCropClose() {
    setShowCropWindow(false);
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        return { ...file, ["cropActive"]: false };
      });
    });
  }

  const cropActiveFile = files.find((file) => file?.cropActive === true);

  const closeModalFn = useCallback(function closeModal() {
    setIsUpdate(false);
  }, []);

  return (
    <div>
      <div className="relative bg-white mt-28 mx-72 mb-28 rounded-xl overflow-hidden shadow-xl h-96 w-auto ">
        {isUpdate && (
          <Modal open={isUpdate}>
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 pl-4 pt-4">
                {!showCropWindow ? "Upload Image(s)" : "Crop Image"}
              </h2>
              <button
                className="  mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 px-2 h-8 border border-gray-400 rounded shadow "
                onClick={closeModalFn}
              >
                X
              </button>
            </div>
            <h3 className="text-neutral-500 pl-4">
              {!showCropWindow
                ? `You may upload upto ${MAX_LENGTH} images`
                : ""}
            </h3>
            {!showCropWindow && (
              <Dropzone
                files={files}
                setFiles={setFiles}
                closeModal={closeModalFn}
                handleCrop={handleCrop}
                setError={setLoading}
                rejected={rejected}
                setRejectedFiles={setRejectedFiles}
              />
            )}
            {showCropWindow && (
              <div>
                <CropperComponent
                  imageUrl={cropActiveFile.preview}
                  handleCropClose={handleCropClose}
                  id={cropActiveFile.id}
                  files={files}
                  setFiles={setFiles}
                  setShowCropWindow={setShowCropWindow}
                />
              </div>
            )}
          </Modal>
        )}
        <div className="relative">
          <img
            src="/cover-photo.jpg"
            alt="cover_photo"
            className="object-cover w-full h-48"
          />
          <div className="absolute bottom-6 left-36 transform -translate-x-1/2 translate-y-1/2">
            <img
              className="
            w-36
            h-36
            object-cover
            rounded-full
            border-4
            border-white"
              src={
                files.find((file) => file?.selected === true)?.preview ||
                "/profile_pic.jpg"
              }
              alt="profile_pic"
            />
          </div>
        </div>
        <div className="relative">
          <button
            className="absolute mr-4 right-0 justify-end bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 py-2 px-4 border border-gray-400 rounded shadow"
            onClick={handleUpdatePicture}
          >
            Update Picture
          </button>
        </div>
        <h2 className="font-bold text-4xl ml-8 mt-14">Sachin B N</h2>
        <div className="text-base mt-8 ml-6">
          <span className="p-2">@sachin_b_n</span>
          <span className="p-2">Full Stack Developer</span>
          <span className="p-2">He/Him</span>
        </div>
      </div>
    </div>
  );
}
