import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, clearUserName, fetchUserName } from "../store/authSlice";
import api from "../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    gender: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const usernameInputRef = useRef(null);
  const changePasswordREf = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setEditFormData({
          username: response.data.username || "",
          gender: response.data.gender || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    if (isEditing && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
    if (changePasswordREf.current) {
      changePasswordREf.current.focus();
    }
  }, [isEditing, showPasswordModal]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      username: profile.username || "",
      gender: profile.gender || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const response = await api.put("/api/user/profile", editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");

      // Clear the cached username and immediately fetch the updated one
      dispatch(clearUserName());
      dispatch(fetchUserName());

      // Refresh the page to update all components including navbar
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.put(
        "/api/user/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response.data || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await api.delete("/api/user/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Account deleted successfully!");

      // Clear auth data and redirect to home
      dispatch(clearUserName());
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
  };

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [showPasswordModal, showDeleteModal,loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <div className="text-white text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-24">
        <div className="text-white text-lg">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16 px-4 flex justify-center items-center">
      {!showPasswordModal && !showDeleteModal && (
        <div className="max-w-4xl w-full sm:min-w-[60%] mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden ">
            <div className="bg-gradient-to-r from-red-600 to-slate-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-gray-800">
                    {profile.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profile.username}
                  </h1>
                  <p className="text-white">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Your name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        ref={usernameInputRef}
                        className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                      />
                    ) : (
                      <div className="bg-gray-700 p-3 rounded-lg text-white">
                        {profile.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <div className="bg-gray-600 p-3 rounded-lg text-gray-400 cursor-not-allowed">
                      {profile.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Phone
                    </label>
                    <div className="bg-gray-600 p-3 rounded-lg text-gray-400 cursor-not-allowed">
                      {profile.phone || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={editFormData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="bg-gray-700 p-3 rounded-lg text-white">
                        {profile.gender || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Account Settings
                </h3>
                <div className="flex flex-wrap gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={updateLoading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        {updateLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        Cancel editing
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  )}
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => navigate("/my-bookings")}
                        className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        View Bookings
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-gradient-to-r from-red-800 opacity-80 to-pink-800 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        Delete Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        // <div className="fixed inset-0 bg-gray-900 bg-opacity-50  flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full pb-6">
          <div className="flex justify-between items-center rounded-t-lg mb- bg-gradient-to-r from-red-600 to-slate-700 px-6 py-6">
            <h3 className="text-xl font-semibold text-white">
              Change Password
            </h3>
            <button
              onClick={closePasswordModal}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                ref={changePasswordREf}
                className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6 px-6">
            <button
              onClick={handleChangePassword}
              disabled={
                passwordLoading ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed text-white px-2.5 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
            <button
              onClick={closePasswordModal}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
        // </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full pb-6">
          <div className="flex justify-between items-center rounded-t-lg mb- bg-gradient-to-r from-red-600 to-slate-700 px-6 py-6">
            <h3 className="text-xl font-semibold text-white">Delete Account</h3>
            <button
              onClick={closeDeleteModal}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">
                Are you absolutely sure?
              </h4>
              <p className="text-gray-400 mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-4">
                <p className="text-white/90 text-sm">
                  <strong>Warning:</strong> All your booking history,
                  preferences, and personal information will be permanently
                  deleted.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 px-6">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {deleteLoading ? "Deleting Account..." : "Delete "}
            </button>
            <button
              onClick={closeDeleteModal}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
