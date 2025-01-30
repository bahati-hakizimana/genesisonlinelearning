import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from '../../components/Modal';
import PropTypes from "prop-types";
import axios from 'axios';
import {FaEye, FaEyeSlash} from "react-icons/fa";

const Register = ({isModalOpen, setIsModalOpen, setIsLoginModalOpen}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email":
                if (!value) {
                    error = "Please provide an email.";
                } else if (!emailRegex.test(value)) {
                    error = "Please provide a valid email.";
                }
                break;
            case "phoneNumber":
                if (!phoneRegex.test(value)) {
                    error = "Please provide a valid phone number.";
                }
                break;
            case "password":
                if (!passwordRegex.test(value)) {
                    error = "Password must be at least 8 characters long and include letters, numbers, and symbols.";
                }
                break;
            case "confirmPassword":
                if (value !== password) {
                    error = "Passwords do not match.";
                }
                break;
            default:
                if (!value) {
                    error = `Please provide a ${name}.`;
                }
        }
        setErrors((prevErrors) => ({...prevErrors, [name]: error}));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "phoneNumber":
                setPhoneNumber(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {};
        if (!email) newErrors.email = "Please provide an email.";
        if (!emailRegex.test(email)) newErrors.email = "Please provide a valid email.";
        if (!phoneRegex.test(phoneNumber)) newErrors.phoneNumber = "Please provide a valid phone number.";
        if (!passwordRegex.test(password)) newErrors.password = "Password must be at least 8 characters long and include letters, numbers, and symbols.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('https://web-production-8aa8.up.railway.app/api/register/', {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: phoneNumber,
                password: password,
            });

            if (response.status === 201) {
                setIsModalOpen(false);
                setIsLoginModalOpen(true);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            setErrors({form: "Error creating account. Please try again."});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="mx-auto bg-white">
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
                {errors.form && <p className="text-red-600 text-center mb-4">{errors.form}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={handleChange}
                        />
                        {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Enter your password"
                                value={password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-400  hover:text-gray-500"
                            >
                                {isPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-400  hover:text-gray-500"
                            >
                                {isConfirmPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className={`w-full py-2 bg-[#4175B7] text-white rounded-md hover:bg-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Register"}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsLoginModalOpen(true);
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

Register.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    setIsLoginModalOpen: PropTypes.func.isRequired,
};

export default Register;