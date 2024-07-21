import { useState } from "react";

import Cropper from "react-easy-crop";
import getCroppedImg from "../util/cropImage";

export default function CropperComponent({
  setShowCropWindow,
  setFiles,
  imageUrl,
  handleCropClose,
  id,
}) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onSave = async (selectedFileId) => {
    setShowCropWindow(false);
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.id === selectedFileId) {
          const fileobj = {
            ...file,
            ["preview"]: croppedImageUrl,
          };
          return fileobj;
        } else {
          return file;
        }
      });
    });
  };

  return (
    <>
      <div className="flex justify-center top-0  left-0 right-0  bottom-0  rounded-xl h-96 ">
        <div className="absolute  p-44 ">
          <Cropper
            image={imageUrl}
            zoom={zoom}
            crop={crop}
            aspect={aspect}
            // disableAutomaticStylesInjection
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
      </div>
      <div className="flex  justify-center">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onInput={(e) => {
            onZoomChange(e.target.value);
          }}
        ></input>
      </div>
      <div className="flex mb-4 justify-center ">
        <button
          className=" mr-4   bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 py-2 px-4 border border-gray-400 rounded shadow"
          type="button"
          onClick={() => onSave(id)}
        >
          Save
        </button>
        <button
          className="   bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 py-2 px-4 border border-gray-400 rounded shadow"
          type="button"
          onClick={() => handleCropClose(id)}
        >
          Close
        </button>
      </div>
    </>
  );
}
