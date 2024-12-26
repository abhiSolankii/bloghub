import { createContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidgetBlogImage({ uwConfig, setState }) {
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
        if (error) {
          toast.error("Image upload failed. Please try again.");
          console.error("Cloudinary upload error:", error);
        } else if (result.event === "success") {
          console.log("Upload successful. Image info: ", result.info);
          setState(result.info.secure_url);
          toast.success("Image uploaded successfully!");
        }
      }
    );

    widget.open(); // Open the widget
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <Button
        onClick={initializeCloudinaryWidget}
        className="w-fit border-2 border-dotted border-purple-500"
        variant="outline"
        type="button"
        disabled={!loaded} // Disable button until script is fully loaded
      >
        Click here
      </Button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidgetBlogImage;
export { CloudinaryScriptContext };
