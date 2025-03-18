import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';

function AdminDashboard() {
    const { backendUrl } = useContext(AppContent);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
                withCredentials: true
            });
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching users');
        }
    };
    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, {
                withCredentials: true
            });
            if (data.success) {
                setStats(data.stats);
            } else {
                toast.error('Failed to fetch stats');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching stats');
        }
    };

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/blogs`, {
                withCredentials: true
            });
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching blogs');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
                withCredentials: true
            });
            
            if (data.success) {
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh user list
            } else {
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Error deleting user');
        }
    };

    const handleToggleExpert = async (userId) => {
        try {
            const userToUpdate = users.find(user => user._id === userId);
            const { data } = await axios.patch(`${backendUrl}/api/admin/users/${userId}`, {
                isExpert: !userToUpdate.isExpert
            }, {
                withCredentials: true
            });
            
            if (data.success) {
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, isExpert: !user.isExpert }
                        : user
                ));
                toast.success(`User ${!userToUpdate.isExpert ? 'is now an expert' : 'is no longer an expert'}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating expert status');
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/blogs/${blogId}`, {
                withCredentials: true
            });
            if (data.success) {
                toast.success('Blog deleted successfully');
                setBlogs(blogs.filter(blog => blog._id !== blogId));
                // Refresh stats to update blog count
                fetchStats();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting blog');
        }
    };

    useEffect(() => {
        Promise.all([fetchUsers(), fetchStats(), fetchBlogs()])
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8 mt-16">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl mb-2">Total Users</h3>
                        <p className="text-3xl font-bold">{stats?.userCount || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl mb-2">Total Blogs</h3>
                        <p className="text-3xl font-bold">{stats?.blogCount || 0}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.isAccountVerified ? 
                                            <span className="text-green-600">Yes</span> : 
                                            <span className="text-red-600">No</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleExpert(user._id)}
                                            className={`px-3 py-1 rounded ${
                                                user.isExpert 
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        >
                                            {user.isExpert ? 'Expert' : 'Make Expert'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Blogs Section */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <h2 className="text-xl font-bold p-6 bg-gray-50 border-b">Manage Blogs</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map(blog => (
                                    <tr key={blog._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{blog.author?.name || 'Unknown Author'}</div>
                                            <div className="text-sm text-gray-500">{blog.author?.email || 'No email'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard; 