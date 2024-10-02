import React, { useState, useCallback } from "react";
import { ArrowUp, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const InputArea = ({ isDarkMode, onSubmit }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      isImageFile(file)
    );
    addFiles(files);
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files).filter((file) =>
      isImageFile(file)
    );
    addFiles(files);
  }, []);

  const isImageFile = (file) => {
    return (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    );
  };

  const addFiles = (files) => {
    const newFiles = [...uploadedFiles, ...files];
    if (newFiles.length <= 5) {
      setUploadedFiles(newFiles);
    }
  };

  const removeFile = useCallback((index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      let data;
      if (inputValue) {
        const cleanedUrl = cleanBigBasketURL(inputValue);
        if (!isValidBigBasketURL(inputValue)) {
          alert("Please enter a valid BigBasket product link.");
          setIsLoading(false);
          return;
        }
        data = { url: cleanedUrl };
      } else if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append("images", file);
        });
        data = formData;
      } else {
        alert("Please provide either a URL or upload images.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://translation-periodically-surveys-ratings.trycloudflare.com/process_product", {
          method: "POST",
          body: data instanceof FormData ? data : JSON.stringify(data),
          headers: data instanceof FormData ? {} : { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const productData = await response.json(); // Get product data from response
          console.log("Product data submitted successfully!", productData);
          onSubmit(inputValue, uploadedFiles, productData); // Pass productData to onSubmit
        } else {
          console.error("Error submitting product data:", response.status);
          alert("Error submitting product data. Please try again later.");
        }
      } catch (error) {
        console.error("Error submitting product data:", error);
        alert("Error submitting product data. Please try again later.");
      } finally {
        setIsLoading(false);
        setInputValue("");
        setUploadedFiles([]);
      }
    },
    [inputValue, uploadedFiles, onSubmit]
  );

  const isValidBigBasketURL = (url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.hostname === "www.bigbasket.com";
    } catch (error) {
      return false;
    }
  };

  const cleanBigBasketURL = (url) => {
    const questionMarkIndex = url.indexOf("?");
    if (questionMarkIndex !== -1) {
      return url.substring(0, questionMarkIndex);
    }
    return url;
  };
  return (
    <div className="w-full max-w-2xl">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onSubmit={handleSubmit}
        className={`rounded-lg shadow-lg border overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
        }`}
        style={{
          height: inputValue ? "auto" : "260px",
        }}
      >
        <div
          className={`flex items-center p-4 rounded-t-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <input
            type="text"
            placeholder="Add any food product link from BigBasket"
            className={`flex-grow focus:outline-none ${
              isDarkMode ? "text-gray-300 bg-gray-800" : "text-gray-700 bg-white"
            } text-base`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <span className="relative">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={uploadedFiles.length === 0 && !inputValue}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                isDarkMode
                  ? uploadedFiles.length > 0 || inputValue
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : uploadedFiles.length > 0 || inputValue
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } ${isLoading && "opacity-50 cursor-wait"}`}
            >
              {isLoading ? (
                <span className="animate-spin mr-2">
                  {/* Add a loading spinner icon here if you want */}
                </span>
              ) : (
                <ArrowUp className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Processing..." : "Send"}
            </motion.button>
            {uploadedFiles.length === 0 && !inputValue && (
              <div className="tooltip" data-tip="Please add at least one file or a URL to continue"></div>
            )}
          </span>
        </div>

        {/* Conditionally render the file upload area with animation */}
        <AnimatePresence>
          {!inputValue && (
            <motion.div
              key="fileUploadArea"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-4 flex flex-col items-center justify-center rounded-lg transition-all duration-300
                ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}
                ${
                  isDragging
                    ? "border-2 border-dashed border-blue-500 bg-opacity-50"
                    : "border border-dashed"
                }
                ${isDarkMode ? "border-gray-600" : "border-gray-300"}
                shadow-md hover:shadow-lg`}
              >
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {uploadedFiles.length > 0 ? (
                  <div className="w-full max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                    <div className="flex flex-wrap gap-4">
                      <AnimatePresence>
                        {uploadedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex items-center ${
                              isDarkMode ? "bg-gray-800" : "bg-gray-200"
                            } rounded-md p-3 relative group`}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                            <div>
                              <span className="text-sm font-medium truncate max-w-[150px] block">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.preventDefault();
                                removeFile(index);
                              }}
                              className={`absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                            >
                              <X size={14} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <motion.label
                    htmlFor="fileInput"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center cursor-pointer h-32 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="text-sm text-center">
                      Drop upto 5 images (jpg/jpeg/png) here or click to upload
                    </p>
                  </motion.label>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
};

export default InputArea;