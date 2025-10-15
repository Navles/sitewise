import React, { useState, useRef, useEffect } from "react";
import { X, Upload, File, Check, Box, CreditCard as Edit3, Trash2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  componentType: "restroom" | "corridor";
  componentName: string;
  existingMap?: string;
  onDeleteMap?: () => void;
  existingFixture?: string;
  onUploadFixture?: (file: File) => void;
  onDeleteFixture?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  componentType,
  componentName,
  existingMap,
  onDeleteMap,
  existingFixture,
  onUploadFixture,
  onDeleteFixture,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 2D map
  const [selectedFixtureFile, setSelectedFixtureFile] = useState<File | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false); // map success
  const [showFixtureSuccess, setShowFixtureSuccess] = useState(false); // fixture success
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [isEditingFixture, setIsEditingFixture] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // map input
  const fixtureInputRef = useRef<HTMLInputElement>(null); // fixture input

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      setIsEditingMap(false);
      setIsEditingFixture(false);
      setShowSuccess(false);
      setShowFixtureSuccess(false);
      setSelectedFile(null);
      setSelectedFixtureFile(null);
      setDragActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------- Drag & Drop helpers ----------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) setSelectedFile(file);
    }
  };

  // ---------- File handlers ----------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) setSelectedFile(file);
    }
  };

  const handleFixtureFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) setSelectedFixtureFile(file);
    }
  };

  // ---------- Actions ----------
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setShowSuccess(true);
      setIsEditingMap(false);
      setSelectedFile(null);
    }
  };

  const handleFixtureUpload = () => {
    if (selectedFixtureFile && onUploadFixture) {
      onUploadFixture(selectedFixtureFile);
      setShowFixtureSuccess(true);
      setIsEditingFixture(false);
      setSelectedFixtureFile(null);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowFixtureSuccess(false);
    setSelectedFile(null);
    setSelectedFixtureFile(null);
    setIsEditingMap(false);
    setIsEditingFixture(false);
    onClose();
  };

  const handleEditMap = () => {
    setIsEditingMap(true);
    setIsEditingFixture(false); // <-- ensure fixture editor never shows when editing map
    setShowSuccess(false);
  };

  const handleEditFixture = () => {
    setIsEditingFixture(true);
    setIsEditingMap(false); // <-- ensure map editor is closed when editing fixture
    setShowFixtureSuccess(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this 2D map? This action cannot be undone."
      )
    ) {
      onDeleteMap?.();
      handleClose();
    }
  };

  const handleDeleteFixture = () => {
    if (
      window.confirm(
        "Are you sure you want to delete the fixture details? This action cannot be undone."
      )
    ) {
      onDeleteFixture?.();
      handleClose();
    }
  };

  // ---------- Simple, explicit mode resolver ----------
  // This ordering removes the confusing duplicate ternaries and guarantees the right view opens.
  let mode:
    | "map-success"
    | "fixture-success"
    | "map-edit"
    | "fixture-edit"
    | "view"
    | "map-upload";

  if (showSuccess) mode = "map-success";
  else if (showFixtureSuccess) mode = "fixture-success";
  else if (isEditingMap) mode = "map-edit";
  else if (isEditingFixture) mode = "fixture-edit";
  else if (existingMap) mode = "view";
  else mode = "map-upload";

  const canShowFixtureSection = componentType === "restroom"; // fixtures only for restrooms

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 px-6 py-4 rounded-t-xl border-b border-blue-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            {mode === "map-success"
              ? "2D Map Uploaded Successfully"
              : mode === "fixture-success"
              ? "Fixture Details Uploaded Successfully"
              : mode === "view"
              ? `View 2D Map - ${componentName}`
              : mode === "map-edit"
              ? `Replace 2D Map - ${componentName}`
              : `Upload 2D Map - ${componentName}`}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {mode === "map-success" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  2D Map Uploaded Successfully!
                </h4>
                <p className="text-slate-300 mb-6">
                  Your 2D map has been uploaded. Here's the corresponding 3D
                  visualization:
                </p>
              </div>

              {/* Show uploaded 2D map */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <File className="h-5 w-5 text-green-400" />
                  <h5 className="text-white font-medium">Uploaded 2D Map</h5>
                </div>
                <div className="relative">
                  {existingMap && (
                    <img
                      src={existingMap}
                      alt="Uploaded 2D Map"
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Box className="h-5 w-5 text-blue-400" />
                  <h5 className="text-white font-medium">
                    3D Map Visualization
                  </h5>
                </div>
                <div className="relative">
                  <img
                    src="/3D_image.jpeg"
                    alt="3D Map Visualization"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "fixture-success" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Fixture Details Uploaded Successfully!
                </h4>
                <p className="text-slate-300 mb-6">
                  Your fixture details have been uploaded and saved.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <File className="h-5 w-5 text-green-400" />
                  <h5 className="text-white font-medium">Fixture Details</h5>
                </div>
                <div className="relative">
                  {existingFixture && (
                    <img
                      src={existingFixture}
                      alt="Fixture Details"
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === "view" && (
            <div className="space-y-6">
              <p className="text-slate-300 mb-4">
                View and manage your {componentType} content.
              </p>

              {/* Existing 2D Map */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <File className="h-5 w-5 text-green-400" />
                    <h5 className="text-white font-medium">Current 2D Map</h5>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEditMap}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {existingMap && (
                    <img
                      src={existingMap}
                      alt="Current 2D Map"
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>
              </div>

              {/* Corresponding 3D Map */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Box className="h-5 w-5 text-blue-400" />
                  <h5 className="text-white font-medium">
                    3D Map Visualization
                  </h5>
                </div>
                <div className="relative">
                  <img
                    src="/3D_image.jpeg"
                    alt="3D Map Visualization"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      console.error('Failed to load 3D image');
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('3D image loaded successfully');
                    }}
                  />
                </div>
              </div>

              {/* Fixture Details Section - Only for restrooms */}
              {canShowFixtureSection && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <File className="h-5 w-5 text-orange-400" />
                      <h5 className="text-white font-medium">
                        Fixture Details
                      </h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      {existingFixture ? (
                        <>
                          <button
                            onClick={handleEditFixture}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={handleDeleteFixture}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEditFixture}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Upload className="h-3 w-3" />
                          <span>Upload</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    {existingFixture ? (
                      <img
                        src={existingFixture}
                        alt="Fixture Details"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No fixture details uploaded</p>
                          <p className="text-xs mt-1">
                            Click Upload to add fixture details
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "fixture-edit" && (
            <div className="space-y-6">
              <p className="text-slate-300 mb-6">
                Upload fixture details for this {componentType}. Supported
                formats: JPG, PNG, GIF, SVG
              </p>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-orange-500 bg-orange-500 bg-opacity-10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith("image/"))
                      setSelectedFixtureFile(file);
                  }
                }}
              >
                {selectedFixtureFile ? (
                  <div className="space-y-4">
                    <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {selectedFixtureFile.name}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {(selectedFixtureFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">
                        Drag and drop fixture details here
                      </p>
                      <p className="text-slate-400 mb-4">or</p>
                      <button
                        onClick={() => fixtureInputRef.current?.click()}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fixtureInputRef}
                type="file"
                accept="image/*"
                onChange={handleFixtureFileSelect}
                className="hidden"
              />

              {existingFixture && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h5 className="text-white font-medium mb-3">
                    Current Fixture Details (will be replaced)
                  </h5>
                  <img
                    src={existingFixture}
                    alt="Current Fixture Details"
                    className="w-full h-32 object-cover rounded-lg opacity-50"
                  />
                </div>
              )}
            </div>
          )}

          {(mode === "map-upload" || mode === "map-edit") && (
            <div className="space-y-6">
              {mode === "map-edit" ? (
                <p className="text-slate-300 mb-6">
                  Replace the existing 2D map for this {componentType}.
                  Supported formats: JPG, PNG, GIF, SVG
                </p>
              ) : (
                <p className="text-slate-300 mb-6">
                  Upload a 2D map for this {componentType}. Supported formats:
                  JPG, PNG, GIF, SVG
                </p>
              )}

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-500 bg-opacity-10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">
                        Drag and drop your 2D map here
                      </p>
                      <p className="text-slate-400 mb-4">or</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {existingMap && mode === "map-edit" && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h5 className="text-white font-medium mb-3">
                    Current 2D Map (will be replaced)
                  </h5>
                  <img
                    src={existingMap}
                    alt="Current 2D Map"
                    className="w-full h-32 object-cover rounded-lg opacity-50"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-slate-800 px-6 py-4 rounded-b-xl border-t border-slate-700">
          {mode === "map-success" && (
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {mode === "fixture-success" && (
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {mode === "view" && (
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {mode === "fixture-edit" && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFixtureUpload}
                disabled={!selectedFixtureFile}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                {existingFixture ? "Replace Fixture" : "Upload Fixture"}
              </button>
            </div>
          )}

          {(mode === "map-upload" || mode === "map-edit") && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                {mode === "map-edit" ? "Replace Map" : "Upload Map"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};