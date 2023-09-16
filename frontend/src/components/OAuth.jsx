import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      // console.log(result.user.displayName);

      // fetch to post data in database
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      // console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className=' flex justify-center items-center gap-4 w-[384px] p-2 border bg-gray-200 uppercase font-semibold tracking-wider hover:opacity-80 disabled:opacity-60 rounded-lg shadow-sm'
    >
      <img
        className='h-6 w-6'
        src='https://cdnlogo.com/logos/g/35/google-icon.svg'
        alt='Google logo'
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuth;
