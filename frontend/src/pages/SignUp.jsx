import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      setLoading(false);

      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      <h1 className='text-center mt-9 font-semibold text-2xl '>
        Create your account
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center justify-center gap-3 mt-5'
      >
        <input
          className='p-2 w-full max-w-sm border rounded-lg'
          type='text'
          placeholder='Username'
          id='username'
          onChange={handleChange}
        />
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
        <button
          disabled={loading}
          className='p-2 w-full max-w-sm border uppercase text-white font-semibold tracking-wider bg-blue-500 hover:opacity-95 disabled:opacity-75 rounded-lg'
        >
          {loading ? 'Loading...' : 'SIGN UP'}
        </button>
        <OAuth />
      </form>
      <div className='flex max-w-sm gap-1 mt-5 mx-auto'>
        <p>Have an account ?</p>
        <Link to='/signin'>
          <span className='text-blue-500 font-semibold'>Sign in</span>
        </Link>
      </div>
      <p className='max-w-sm mx-auto mt-3 text-red-700 font-semibold'>
        {error && 'Something went wrong'}
      </p>
    </div>
  );
};

export default SignUp;
