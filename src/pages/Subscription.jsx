import {useState, useEffect} from "react";
import Loading from "../components/Loading";
import UpgradePlanModal from "../pages/Modals/UpgradePlan";
import BillingManagementModal from "../pages/Modals/ManageBilling";
import apiService from "../constants/data";
import dayjs from "dayjs";
import {FaCalendarAlt, FaClock} from 'react-icons/fa';

const PLAN_TYPE_CHOICES = {
    premium: "Premium",
    free_trial: "Free Trial",
};

const Subscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const data = await apiService.getAll("current_subscription");
                if (data.detail === "No valid subscription found") {
                    setError(data.detail);
                } else {
                    setSubscription(data);
                }
            } catch (error) {
                console.error("Error fetching subscription:", error);
                setError("Error fetching subscription. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const calculateRemainingDays = (endDate) => {
        const today = dayjs();
        const end = dayjs(endDate);
        return end.diff(today, "day");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 mx-6 bg-white shadow-lg rounded-lg w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-center text-[#4175B7] mb-6">
                    My Plan
                </h1>
                {loading ? (
                    <Loading/>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-lg mb-4">
                            It looks like you don&apos;t have an active subscription. Please upgrade to a plan to enjoy
                            our services.
                        </p>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Upgrade Plan
                        </button>
                    </div>
                ) : subscription ? (
                    <div
                        className="relative bg-gradient-to-r from-[#4175B7]  to-green-500 p-8 rounded-2xl shadow-xl text-white">
                        <div className="absolute top-0 right-0 m-8">
                            <span className="px-3 py-1 text-sm bg-white text-green-500 rounded-full shadow">Active</span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-6">
                            {PLAN_TYPE_CHOICES[subscription.plan_type]}
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <FaCalendarAlt className="text-xl text-white"/>
                                <p className="text-lg">
                                    <span className="font-semibold">Start Date:</span> {subscription.start_date}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaCalendarAlt className="text-xl text-white"/>
                                <p className="text-lg">
                                    <span className="font-semibold">End Date:</span> {subscription.end_date}
                                </p>
                            </div>
                            <div
                                className="flex items-center space-x-3 bg-white text-[#4175B7] p-4 rounded-lg shadow-md">
                                <FaClock className="text-2xl"/>
                                <p className="text-xl font-bold">
                                    <span
                                        className="font-semibold">Remaining Days:</span> {calculateRemainingDays(subscription.end_date)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="w-full px-5 py-3 bg-white text-[#4175B7] font-medium rounded-lg shadow-md hover:bg-gray-200"
                            >
                                Upgrade Plan
                            </button>
                            <button
                                onClick={() => setIsBillingModalOpen(true)}
                                className="w-full px-5 py-3 bg-white text-green-500 font-medium rounded-lg shadow-md hover:bg-gray-200"
                            >
                                Manage Billing
                            </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex justify-center">
                            <div className="w-24 h-1 bg-white rounded-full"/>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-lg text-red-500">
                        No subscription details found.
                    </p>
                )}
            </div>

            {/* Modals */}
            <UpgradePlanModal
                isModalOpen={isUpgradeModalOpen}
                setIsModalOpen={setIsUpgradeModalOpen}
            />
            <BillingManagementModal
                isModalOpen={isBillingModalOpen}
                setIsModalOpen={setIsBillingModalOpen}
            />
        </div>
    );
};

export default Subscription;