import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const SignupLogin = () => {


    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [issignUp, setIssignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: "client",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",

        // advocate
        barId: "",
        experience: "",

        // client
        phone: "",
        address: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    //switch signup/login
    const accountinfo = (term) => {
        setIssignUp(term === "signup")
        setMessage("")
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (issignUp) {


            if (formData.password !== formData.confirmPassword) {
                setMessage("Passwords do not match!");
                setLoading(false);
                return;
            }

            console.log("Signup data:", formData);
            setMessage("Signup UI working");
            setLoading(false);
            setIssignUp(false);
            return;
        }
        //login validation
        console.log("Login data:", {
            email: formData.email,
            password: formData.password,
        });


        setMessage("Login UI working");
        setLoading(false);

        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
                <div className="flex mb-6">
                    <button className={`flex-1 py-2 text-lg sm:text-xl font-semibold transition-all duration-200 ${!issignUp ? "border-b-4 border-(--dark)" : "text-gray-500"}`} onClick={() => accountinfo("login")}>
                        Log In
                    </button>
                    <button className={`flex-1 py-2 text-lg sm:text-xl font-semibold transition-all duration-200 ${issignUp ? "border-b-4 border-(--dark)" : "text-gray-500"}`} onClick={() => accountinfo("signup")}>
                        Sign Up
                    </button>
                </div>
                <form onSubmit={handleSubmit}>{issignUp && (
                    <div className="mb-4">
                        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                            Role
                        </label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
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

                    <div className='mb-4 relative'>
                        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                            Password
                        </label>                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(showPassword)}
                            className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

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
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500"
                            >
                                {!showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    )}

                    {/* ADVOCATE FIELDS */}
                    {issignUp && formData.role === "advocate" && (
                        <>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Bar ID
                                </label>
                                <input
                                    name="barId"
                                    placeholder="Bar ID"
                                    value={formData.barId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                                    Experience
                                </label>
                                <input
                                    name="experience"
                                    placeholder="Years of Experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
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
                        className={`w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-2 rounded-lg text-lg sm:text-xl font-semibold cursor-pointer transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> {/* Spinner icon */}
                                {issignUp ? "Signing Up..." : "Logging In..."}
                            </>
                        ) : issignUp ? (
                            "Sign Up"
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>
                {message && <p className="mt-4 text-center">{message}</p>}

                <p className="text-center mt-4 text-gray-600 text-sm sm:text-base">
                    {issignUp
                        ? "Already have an account? "
                        : "Don't have an account? "}
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