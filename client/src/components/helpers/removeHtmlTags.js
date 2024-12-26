export default function stripHtmlTags(input) {
  // Create a temporary element to utilize the browser's HTML parsing capabilities
  const tempDiv = document.createElement("div");
  // Set the innerHTML of the temporary element to the input string
  tempDiv.innerHTML = input;
  // Extract and return the text content, which removes HTML tags and styles
  return tempDiv.textContent || tempDiv.innerText || "";
}
