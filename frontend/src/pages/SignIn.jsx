import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetError,
} from '../redux/user/userSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      dispatch(resetError());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');

      // setLoading(false);
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div>
      <h1 className='text-center mt-9 font-semibold text-2xl '>
        Sign into your account
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center justify-center gap-3 mt-5'
      >
        <input
          className='p-2 w-full max-w-sm border rounded-lg'
          type='email'
          placeholder='Email'
          id='email'
          onChange={handleChange}
        />
        <input
          className='p-2 w-full max-w-sm border rounded-lg'
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
        />
        <button className='p-2 w-full max-w-sm border uppercase text-white font-semibold tracking-wider bg-blue-500 hover:opacity-95 disabled:opacity-75 rounded-lg'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex max-w-sm gap-1 mt-5 mx-auto'>
        <p>Don&apos;t have an account?</p>
        <Link to='/signup'>
          <span className='text-blue-500 font-semibold'>Sign Up</span>
        </Link>
      </div>
      <p className='flex max-w-sm gap-1 mt-5 mx-auto text-red-700 font-semibold'>
        {error ? error.message || 'Something Went Wrong' : ''}
      </p>
    </div>
  );
};

export default SignIn;
