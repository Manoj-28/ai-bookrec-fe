import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');


    // const [bookmarks, setBookmarks] = useState([
    //     { id: 1, title: 'Book 1', author: 'Author 1' },
    //     { id: 2, title: 'Book 2', author: 'Author 2' },
    // ]);

    // const [orders, setOrders] = useState([
    //     { id: 1, date: '2023-05-15', total: 29.99, status: 'Delivered' },
    //     { id: 2, date: '2023-06-20', total: 19.99, status: 'Shipped' },
    // ]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        try {
            // Replace with your actual API call
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/api/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.message || "Password change failed");
                return;
            }

            setPasswordSuccess("Password changed successfully");
            setPasswordError("");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            
            // Clear success message after 3 seconds
            setTimeout(() => setPasswordSuccess(""), 3000);
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError("An error occurred. Please try again.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gray-800 px-6 py-8 text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user?.name || user?.email}</h1>
                                <p className="text-gray-300">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Account Details
                            </button>
                            {/* <button
                                onClick={() => setActiveTab('bookmarks')}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'bookmarks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                My Bookmarks
                            </button> */}
                            {/* <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'password' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Change Password
                            </button> */}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Account Details */}
                        {activeTab === 'details' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bookmarks */}
                        {/* {activeTab === 'bookmarks' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">My Bookmarks</h2>
                                {bookmarks.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookmarks.map(book => (
                                            <div key={book.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                                                    <p className="text-sm text-gray-500">{book.author}</p>
                                                </div>
                                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">You haven't bookmarked any books yet.</p>
                                )}
                            </div>
                        )} */}

                        {/* Orders */}
                        {/* {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">My Orders</h2>
                                {orders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map(order => (
                                                    <tr key={order.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                                )}
                            </div>
                        )} */}

                        {/* Change Password */}
                        {/* {activeTab === 'password' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    {passwordError && (
                                        <div className="text-sm text-red-600">{passwordError}</div>
                                    )}
                                    {passwordSuccess && (
                                        <div className="text-sm text-green-600">{passwordSuccess}</div>
                                    )}
                                    <div>
                                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <input
                                            type="password"
                                            id="oldPassword"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};