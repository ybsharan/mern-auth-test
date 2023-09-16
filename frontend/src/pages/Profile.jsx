import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signout,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  // console.log(image);
  const [imagePercent, setImagePercent] = useState(0);
  // console.log(imagePercent);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is', progress + '% done');
        setImagePercent(Math.round(progress));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart(true));
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure());
    }
  };

  const handleSignout = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col'>
      <h1 className='font-semibold text-2xl my-3 mt-5 mx-auto'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          className='mx-auto '
          ref={fileRef}
          type='file'
          hidden
          accept='image/*'
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <img
          className=' h-24 w-24 rounded-full mx-auto object-cover cursor-pointer'
          src={formData.profilePicture || currentUser.profilePicture}
          alt='Profile'
          onClick={() => fileRef.current.click()}
        />
        <p className='mx-auto'>
          {imageError ? (
            <span className='text-red-700'>
              Error Uploading image (File Size must be less than 5 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-green-600 text-sm font-semibold'>{`Uploading image: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-600 text-sm font-semibold'>
              Image Uploaded Successfully
            </span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          className='border-[1px] p-2 w-full max-w-sm mx-auto rounded-lg'
          type='text'
          placeholder='Username'
          id='username'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          className=' border-[1px] p-2 w-full max-w-sm mx-auto rounded-lg'
          type='email'
          placeholder='Email'
          id='email'
          onChange={handleChange}
        />
        <input
          className='border-[1px]  p-2 w-full max-w-sm mx-auto rounded-lg'
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
        />
        <button className='uppercase w-full border max-w-sm mx-auto p-2 rounded-lg tracking-wider bg-blue-500 text-white font-semibold disabled:opacity-75 hover:opacity-90'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between max-w-sm mx-auto w-full my-3'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-600 hover:text-red-700 cursor-pointer font-semibold'
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className='text-red-600 hover:text-red-700 cursor-pointer font-semibold'
        >
          Sign Out
        </span>
      </div>
      <p className='mx-auto w-full text-sm max-w-sm text-red-700 font-semibold '>
        {error && 'Something went wrong'}
      </p>
      <p className='mx-auto w-full text-sm max-w-sm text-green-700 font-semibold'>
        {updateSuccess && 'User updated Successfully!'}
      </p>
    </div>
  );
};

export default Profile;
