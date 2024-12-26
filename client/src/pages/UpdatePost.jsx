import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";
import UploadWidgetBlogImage from "@/components/UploadWidgetBlogImage";
import { useSelector } from "react-redux";
import { FaMagic, FaPen, FaCopy } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";

const UpdatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { postId } = useParams();

  const [originalPostData, setOriginalPostData] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update initial states after fetching original post data
  useEffect(() => {
    const fetchOriginalPostData = async () => {
      try {
        setLoading(true);
        const res = await apiRequest.get(`/post/getposts?postId=${postId}`);
        const postData = res.data.posts[0];
        setOriginalPostData(postData);
        setTitle(postData.title || "");
        setCategory(postData.category || "0");
        setImage(postData.image || "");
        setContent(postData.content || "");
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error fetching post");
        setLoading(false);
      }
    };
    fetchOriginalPostData();
  }, [postId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please give title.");
      return;
    }
    if (!content) {
      toast.error("Please give content.");
      return;
    }
    if (!category) {
      toast.error("Please give category.");
      return;
    }
    if (!image) {
      toast.error("Please upload a cover image.");
      return;
    }

    const payload = {
      title,
      category,
      image,
      content,
      author: currentUser.fullname,
    };

    try {
      setLoading(true);
      const response = await apiRequest.put(
        `/post/updatepostbyid/${postId}/${currentUser._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Blog updated successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/dashboard?tab=profile");
      }, 500);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update the blog. Please try again."
      );
      console.error("Error updating post:", error);
      setLoading(false);
    }
  };

  // Generate AI answer with typing animation
  const generateAnswer = async () => {
    if (!prompt || prompt === "") {
      return toast.error("Please enter the message.");
    }
    setAnswer("");
    const data = { prompt };

    try {
      setIsTyping(true);
      const res = await apiRequest.post("/post/generate-answer", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const generatedAnswer = res.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
      setIsTyping(false);
    } catch (error) {
      console.error("Error in generating answer: ", error);
      toast.error(
        error.response?.data?.message || "Error in generating answer"
      );
      setIsTyping(false);
    }
  };

  // Copy generated answer to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    toast.success("Answer copied to clipboard!");
  };

  return (
    <>
      <div className="min-h-screen w-[90%] lg:w-[70%] mx-auto my-12 p-8 text-black rounded-xl shadow-xl">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight font-serif">
            Create Your Blog
          </h1>
          <p className="text-xl opacity-80 mt-4">
            Let your thoughts flow and captivate the world!
          </p>
        </div>
        {originalPostData ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Title and Category */}
            <div className="flex flex-col lg:flex-row gap-6">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                type="text"
                name="title"
                className="w-full outline-none focus:ring-4 focus:ring-white/40 transition-all"
                required
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px] text-black">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="0">Uncategorized</SelectItem>
                    <SelectItem value="1">Technology</SelectItem>
                    <SelectItem value="2">Food</SelectItem>
                    <SelectItem value="3">Politics</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="flex gap-2 items-center border border-black p-4 border-dashed rounded-lg bg-opacity-10">
              <Label className="font-semibold text-lg">
                Upload Cover Image
              </Label>
              <UploadWidgetBlogImage
                uwConfig={{
                  cloudName: "dp2jsbp3k",
                  uploadPreset: "BlogHub",
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "png", "jpeg"],
                  multiple: false,
                  maxImageFileSize: 20000000,
                  folder: "avatars",
                }}
                setState={setImage}
              />
            </div>
            {image && <img src={image} className="w-60 h-60 rounded-lg" />}

            {/* Generate blog with AI */}
            <div className="my-2 flex flex-col gap-2">
              <Label className="font-semibold text-lg flex gap-2 items-center">
                Generate your blog with{" "}
                <span className="text-purple-500 text-2xl">AI</span>{" "}
                <span>
                  <FaMagic className="text-blue-500 text-2xl" />
                </span>
              </Label>

              <div className="grid w-full gap-2">
                <Textarea
                  placeholder="Write your questions here..."
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }}
                />
                <p className="text-[12px] opacity-60">
                  Hi! I'm your AI writing assistant. Give me a prompt like
                  `write a paragraph on meditation` or `suggest blog titles on
                  sustainability.` Let's create!
                </p>
                <Button
                  variant="outline"
                  className=" bg-gradient-to-r from-purple-500 to-pink-400 hover:to-purple-400"
                  type="button"
                  onClick={generateAnswer}
                  disabled={isTyping}
                >
                  {isTyping ? (
                    <p className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 50 50"
                        className="animate-spin"
                      >
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          stroke="black"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          className="opacity-80"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          stroke="transparent"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          className="stroke-blue-500 animate-spin-slow"
                        />
                      </svg>
                      <span>Writing for you ... </span>{" "}
                    </p>
                  ) : (
                    <p className="flex gap-2 items-center">
                      {" "}
                      DO THE MAGIC
                      <span>
                        <FaMagic />
                      </span>
                    </p>
                  )}
                </Button>
              </div>
            </div>

            {/* AI Generated Answer */}
            {answer && (
              <div className="my-6 p-6 bg-gray-100 rounded-lg shadow-md">
                <Label className="font-semibold text-lg flex gap-2 items-center">
                  AI Generated Answer{" "}
                  <span>
                    <FaPen className="text-blue-500 text-2xl" />
                  </span>
                </Label>
                <div className="relative">
                  <div className="p-4 bg-white rounded-lg shadow-inner text-gray-800 h-auto max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-wrap min-h-40">{answer}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="absolute top-0 right-0 mt-2 mr-2 bg-green-400 hover:bg-green-500 text-white"
                    onClick={handleCopy}
                    type="button"
                  >
                    <FaCopy className="mr-2" /> Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Rich Text Editor */}
            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Express your thoughts..."
                className="h-72 bg-white text-black rounded-md shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="mt-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 hover:from-green-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              {loading ? <p>Updating...</p> : <p>Update Blog</p>}
            </Button>
          </form>
        ) : (
          <Loader text="" />
        )}
      </div>
    </>
  );
};

export default UpdatePost;
