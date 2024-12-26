import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({
  uwConfig,
  setState,
  filePickerRef,
  setUpdateForm,
  setSaveButton,
}) {
  const [loaded, setLoaded] = useState(false);

  // Load Cloudinary's upload widget script dynamically
  useEffect(() => {
    if (!loaded) {
      const existingScript = document.getElementById(
        "cloudinary-widget-script"
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "cloudinary-widget-script";
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
      } else {
        setLoaded(true); // Script is already in the DOM
      }
    }
  }, [loaded]);

  // Initialize the Cloudinary widget
  const initializeCloudinaryWidget = () => {
    if (!loaded) return;

    const widget = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        if (!error && result.event === "success") {
          console.log("Upload successful. Image info: ", result.info);
          setState(result.info.secure_url); // Update state with image URL
          setUpdateForm((prev) => ({
            ...prev,
            profilePicture: result.info.secure_url,
          }));
          setSaveButton(true);
        }
      }
    );

    widget.open(); // Open the widget
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        className=""
        onClick={initializeCloudinaryWidget}
        ref={filePickerRef} // Use ref for potential programmatic control
        disabled={!loaded} // Disable button until script is fully loaded
      ></button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
