import { useEffect, useState } from "react";
import imgLoad from "../../assets/loading.gif";
import noImage from "../../assets/noImage.png"

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [expandedContent, setExpandedContent] = useState({});

  const handleReadMore = (postId) => {
    setExpandedContent((prevExpandedContent) => ({
      ...prevExpandedContent,
      [postId]: !prevExpandedContent[postId],
    }));
  };

  const user_id = localStorage.getItem('userUid');

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/get-post/${user_id}`);
        const data = await response.json();
        if (response.status === 200) {
          setBlogPosts(data);
          console.log(data);
          setIsLoading(false);
        } else {
          throw new Error("Error");
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getUserPosts();
  }, []);

  const formatCreatedAt = (createdAt) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'PST' };
    return new Date(createdAt).toLocaleString('en-US', options);
  };

  const handleDeletePost = async (post_id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-post/${user_id}/${post_id}`, {
        method: 'DELETE',
      });
  
      if (response.status === 204) {
        window.location.reload();
      } else if (response.status === 404) {
        alert('Post not found');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post', error);
      alert('Failed to delete post');
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  return (
    <div className="flex flex-col gap-5 p-20">
      <h1 className="text-center text-4xl font-mono font-bold">Your Blog Posts</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <img src={imgLoad} alt="Loading" />
        </div>
      ) : (
        blogPosts.length === 0 ? (
          <p className="text-center text-xl text-gray-800">You have no Blog Posts yet</p>
        ) : (
        blogPosts.map((post) => (
          <div key={post.post_id} className="flex flex-row border p-6 rounded-lg shadow-md bg-white">
            <div className="flex items-center p-4 mr-4">
              <img
                src={post.img !== null ? `data:image/jpeg;base64,${arrayBufferToBase64(post.img.data)}` : noImage}
                alt={`Post ${post.post_id}`}
                className="w-56 h-56 object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-full border p-4 rounded-lg shadow-md">
              <div>
                <h2 className="text-2xl font-bold mb-1">{post.title}</h2>
                <p className="text-gray-500 text-sm">{formatCreatedAt(post.created_at)}</p>
              </div>
            
              <p className="text-gray-700 mt-4">
                {expandedContent[post.post_id] || post.content.length <= 200
                  ? post.content
                  : `${post.content.substring(0, 200)}... `}
                {post.content.length > 200 && !expandedContent[post.post_id] && (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleReadMore(post.post_id)}
                  >
                    Read More
                  </span>
                )}
              </p>
              <div className="flex justify-end p-2">
              <button
                className="text-white bg-red-500 hover:bg-red-700 py-1 px-3 rounded-md cursor-pointer transition duration-300 ease-in-out"
                onClick={() => handleDeletePost(post.post_id)}
                >
                Delete
              </button>
              </div>
            </div>
          </div>
        ))    
      ))}
    </div>
  );
}

export default Home;
