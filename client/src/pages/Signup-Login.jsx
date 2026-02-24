import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from "../api/api"

const SignupLogin = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [issignUp, setIssignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialFormData = {
        role: "client",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        experience: "",
        specialization: "",
        licenseDocument: null,
        phone: "",
        address: "",
    };

    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const accountinfo = (term) => {
        setIssignUp(term === "signup");
        setMessage("");
        setFormData(initialFormData);
        setShowPassword(false);
        setShowConfirm(false);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // Validation
        if (!isValidEmail(formData.email)) {
            setMessage("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (!isValidPassword(formData.password)) {
            setMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
            setLoading(false);
            return;
        }

        if (issignUp) {
            if (formData.password !== formData.confirmPassword) {
                setMessage("Passwords do not match!");
                setLoading(false);
                return;
            }

            if (formData.role === "advocate" && !formData.licenseDocument) {
                setMessage("Please upload a license document");
                setLoading(false);
                return;
            }

            try {
                const uri = formData.role === "client"
                    ? "/auth/register/client"
                    : "/auth/register/advocate";

                let requestData;

                if (formData.role === "advocate") {
                    // Create FormData for file upload
                    requestData = new FormData();
                    requestData.append('role', formData.role);
                    requestData.append('name', formData.username);
                    requestData.append('email', formData.email);
                    requestData.append('password', formData.password);
                    requestData.append('licenseNumber', formData.licenseNumber);
                    requestData.append('experience', formData.experience);
                    requestData.append('specialization', formData.specialization);
                    requestData.append('licenseDocument', formData.licenseDocument);
                } else {
                    // JSON for client
                    requestData = {
                        name: formData.username,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone,
                        address: formData.address
                    };
                }

                const res = await api.post(uri, requestData);
                setMessage(res.data.message || "Signup successful!");

                setTimeout(() => {
                    setIssignUp(false);
                    setFormData(initialFormData);
                }, 2000);

            } catch (error) {
                setMessage(error.response?.data?.message || "Signup failed. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            // Login logic
            try {
                const res = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem("user", JSON.stringify(res.data.user));


                const user = res.data.user;
                setMessage(res.data.message || "Login successful");

                if (user.role === "admin") {
                    navigate("/admin");
                }
                if (user.role === "advocate") {
                    navigate("/advocate");
                }
                 if (user.role === "client") {
                    navigate("/client");
                }
                if (user.role === "junior_advocate") {
                    navigate("/junior");
                }
console.log("Login response:", res.data);
            } catch (error) {
                setMessage(error.response?.data?.message || "Invalid email or password");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 text-lg sm:text-xl font-semibold transition-all duration-200 ${!issignUp ? "border-b-4 border-gray-900" : "text-gray-500"}`}
                        onClick={() => accountinfo("login")}
                    >
                        Log In
                    </button>
                    <button
                        className={`flex-1 py-2 text-lg sm:text-xl font-semibold transition-all duration-200 ${issignUp ? "border-b-4 border-gray-900" : "text-gray-500"}`}
                        onClick={() => accountinfo("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {issignUp && (
                        <div className="mb-4">
                            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="client">Client</option>
                                <option value="advocate">Advocate</option>
                            </select>
                        </div>
                    )}

                    {issignUp && (
                        <div className='mb-4'>
                            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                    )}

                    <div className='mb-4'>
                        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div className='mb-2 relative'>
                        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500"
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    {issignUp && (
                        <p className="mb-2 text-xs text-gray-500 mt-1">
                            Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
                        </p>
                    )}

                    {issignUp && (
                        <div className='mb-4 relative'>
                            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-9 text-gray-500"
                            >
                                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    )}

                    {/* ADVOCATE FIELDS */}
                    {issignUp && formData.role === "advocate" && (
                        <>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    License Number
                                </label>
                                <input
                                    name="licenseNumber"
                                    placeholder="e.g. KL1254***"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Specialization
                                </label>
                                <input
                                    name="specialization"
                                    placeholder="e.g. Criminal Law"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    placeholder="Years of Experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    License Document
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setFormData({ ...formData, licenseDocument: e.target.files[0] })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                        </>
                    )}

                    {/* CLIENT FIELDS */}
                    {issignUp && formData.role === "client" && (
                        <>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-lg text-lg sm:text-xl font-semibold transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-500"}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {issignUp ? "Signing Up..." : "Logging In..."}
                            </>
                        ) : issignUp ? (
                            "Sign Up"
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center ${message.includes("successful") || message.includes("submitted") || message.includes("registered") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                <p className="text-center mt-4 text-gray-600 text-sm sm:text-base">
                    {issignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => accountinfo(issignUp ? "login" : "signup")}
                    >
                        {issignUp ? "Log In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default SignupLogin;