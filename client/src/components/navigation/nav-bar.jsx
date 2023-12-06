import { Link } from 'react-router-dom';

const NavBar = ({ isAuth, signUserOut }) => {
  return (
    <nav className={`bg-white px-2 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out ${isAuth ? 'sticky z-10 w-full top-0' : ''}`} >
      {!isAuth ? (
        <div className='flex flex-row px-10 gap-6'>
          <Link to="/" className="text-black hover:underline font-serif">Sign In</Link>
          <Link to="/signup" className="text-black hover:underline font-serif">Sign Up</Link>
        </div>
      ) : (
        <div className="flex items-center justify-between px-10">
          <div className='flex flex-row gap-6'>
            <Link to="/homepage" className="text-black hover:underline font-serif">Home</Link>
            <Link to="/createpost" className="text-black hover:underline font-serif">Create Post</Link>
          </div>
          <button onClick={signUserOut} className="text-black hover:underline font-serif">Log Out</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;