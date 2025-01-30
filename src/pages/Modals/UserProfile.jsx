import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import apiService from '../../constants/data';
import PropTypes from "prop-types";

function Profile({ isModalOpen, setIsModalOpen }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        try {
          const userData = await apiService.getAll('profile');

          setFirstName(userData.first_name);
          setLastName(userData.last_name);
          setPhoneNumber(userData.phone_number);
          setEmail(userData.email);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data. Please log out and login again...');
        }
      };

      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setError('');
    setSuccess('');

    try {
      await apiService.update('profile', '', {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: email,
      });
      setSuccess('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setError('');
    setSuccess('');

    try {
      await apiService.create('password_reset', {
        email_or_phone: email || phoneNumber,
        new_password: newPassword,
      });
      setNewPassword('');
      setSuccess('Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="bg-white">
        {isLoggedIn ? (
          <>
            <h2 className="text-lg font-semibold mb-6 text-center">My Profile</h2>
            {error && <p className="text-red-600 text-center">{error}</p>}
            {success && <p className="text-green-600 text-center">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 bg-[#4175B7] text-white rounded-md hover:bg-blue-500 ${isSubmittingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmittingProfile}
              >
                {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <h2 className="text-lg font-semibold mt-8 text-center">Edit Password</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 bg-[#4175B7] text-white rounded-md hover:bg-blue-500 ${isSubmittingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? 'Saving...' : 'Save Password'}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-red-600">You need to be logged in to view this page.</p>
        )}
      </div>
    </Modal>
  );
}

Profile.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default Profile;