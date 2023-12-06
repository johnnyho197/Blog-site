import { useState } from "react";
import {auth} from '../../firebase-config'
import { useNavigate } from "react-router-dom";
import Compressor from "image-compressor.js";
import imgLoad from "../../assets/loading.gif";

const defaultFormFields = {
    img: null,
    title: "",
    postText: "",
  };
  
const CreatePost = () => {
  let navigate = useNavigate();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { title, postText } = formFields;
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
  
    if (name === "img") {
      setImg(files[0]);
    } else {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();
      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("userId", auth?.currentUser?.uid);
        formData.append("title", title);
        formData.append("content", postText);
        // compress image before uploading to firebase storage
        if (img !== null) {
          const compressedImage = await compressImage(img, 800, 600);
          formData.append("img", compressedImage);
        } else formData.append("img", img);
        const response = await fetch("http://localhost:3000/create-post", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
            setFormFields(defaultFormFields);
            setImg(null);
            navigate('/homepage');
        } else {
            throw new Error("Failed to submit post");
        }
      } catch (error) {
          console.error("Error posting data:", error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
  };

  const compressImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        // Calculate new dimensions while maintaining the original aspect ratio
        let newWidth, newHeight;
        if (originalWidth > originalHeight) {
          newWidth = maxWidth;
          newHeight = (originalHeight / originalWidth) * maxWidth;
        } else {
          newWidth = (originalWidth / originalHeight) * maxHeight;
          newHeight = maxHeight;
        }
  
        // Create a canvas to apply orientation correction
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        // Draw the image on the canvas with correct orientation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        // Convert the corrected image to a blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.6);
      };
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-md shadow-md my-36">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <img src={imgLoad} alt="Loading" />
          </div>
        ) : (
          <div className="">
            <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>

            <form className="mt-4" onSubmit={handleSubmitPost}>
              <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-600">
                    Image
                    </label>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleChange}
                      name="img"
                      className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {img && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Selected Image Preview:</p>
                        <div className="flex items-center justify-center max-w-full rounded-md overflow-hidden">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="Selected"
                            className="h-auto max-w-full" // Adjust the height and width as needed
                            style={{ maxHeight: '300px' }} // Set a maximum height for the image
                          />
                        </div>
                      </div>
                    )}
              </div>

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="Title..."
                  name="title"
                  value={title}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="postText" className="block text-sm font-medium text-gray-600">
                  Post
                </label>
                <textarea
                  required
                  onChange={handleChange}
                  name="postText"
                  placeholder="Post..."
                  value={postText}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  {isLoading? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
export default CreatePost;