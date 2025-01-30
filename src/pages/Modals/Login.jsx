import { useState } from "react";
import axiosInstance from "../../constants/httpServices";
import Modal from "../../components/Modal";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

function Login({ isModalOpen, setIsModalOpen, setIsRegisterModalOpen, setIsForgotPasswordModalOpen }) {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ emailOrPhone: "", password: "" });
    const [showPassword, setShowPassword] = useState(false); 

    const isValidEmailOrPhone = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({ emailOrPhone: "", password: "" });

        if (!emailOrPhone) {
            setError((prev) => ({
                ...prev,
                emailOrPhone: "Email or phone is required.",
            }));
            return;
        }
        if (!isValidEmailOrPhone(emailOrPhone)) {
            setError((prev) => ({
                ...prev,
                emailOrPhone: "Enter a valid email or 10-digit phone number.",
            }));
            return;
        }

        if (!password) {
            setError((prev) => ({
                ...prev,
                password: "Password is required.",
            }));
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post("api/login/", {
                email_or_phone: emailOrPhone,
                password: password,
            });

            const { user, refresh, access } = response.data;

            localStorage.setItem("authToken", access);
            localStorage.setItem("refreshToken", refresh);
            localStorage.setItem("user", JSON.stringify(user));

            setEmailOrPhone("");
            setPassword("");
            window.location.href = "/";
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error logging in:", err);
            setError((prev) => ({
                ...prev,
                emailOrPhone: "Invalid credentials. Please try again.",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="mx-auto bg-white">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="emailOrPhone"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            id="emailOrPhone"
                            className={`w-full px-4 py-2 border ${
                                error.emailOrPhone ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none`}
                            placeholder="Enter your email or phone number"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                        />
                        {error.emailOrPhone && (
                            <p className="text-red-500 text-sm mt-1">{error.emailOrPhone}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={`w-full px-4 py-2 border ${
                                    error.password ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {error.password && (
                            <p className="text-red-500 text-sm mt-1">{error.password}</p>
                        )}

                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setIsForgotPasswordModalOpen(true);
                                }}
                                className="text-sm text-[#4175B7] hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-medium ${
                                loading ? "bg-gray-400" : "bg-[#4175B7] hover:bg-blue-500"
                            }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsRegisterModalOpen(true);
                            }}
                            className="text-[#4175B7] hover:underline"
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    );
}

Login.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    setIsRegisterModalOpen: PropTypes.func.isRequired,
    setIsForgotPasswordModalOpen: PropTypes.func.isRequired,
};

export default Login;