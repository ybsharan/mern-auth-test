import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='flex justify-between items-center border h-20 px-16 shadow-lg'>
      <Link to='/'>
        <h1 className='text-2xl font-semibold font-serif px-5 py-1'>
          Mern Auth
        </h1>
      </Link>
      <ul className='flex items-center px-5'>
        <Link to='/'>
          <li className='font-medium px-2 py-1 font-Mono rounded-lg hover:bg-gray-200 mx-2 my-1'>
            Home
          </li>
        </Link>
        <Link to='/about'>
          <li className='font-medium px-2 py-1 font-Mono rounded-lg hover:bg-gray-200 mx-2 my-1'>
            About
          </li>
        </Link>
        <Link to='/profile'>
          {currentUser ? (
            <img
              className='h-7 w-7 rounded-full object-cover'
              src={currentUser.profilePicture}
              alt='profile'
            />
          ) : (
            <li className='font-medium px-2 py-1 font-Mono rounded-lg hover:bg-gray-200 mx-2 my-1'>
              Sign in
            </li>
          )}
        </Link>
      </ul>
    </div>
  );
};

export default Header;
