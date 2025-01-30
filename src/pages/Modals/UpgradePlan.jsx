import PropTypes from "prop-types";
import Modal from "../../components/Modal";
import { useState, useEffect } from "react";
import apiService from '../../constants/data'; 
import PaymentModal from "../../components/PaymentModal";

function UpgradePlanModal({ isModalOpen, setIsModalOpen }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonText, setButtonText] = useState("Upgrade Now");

  const checkPaymentStatus = async () => {
    try {
      const paymentHistory = await apiService.getAll("payment_history"); 

    
      const hasPaid = paymentHistory.some(item => item.plan === "upgrade");
      setIsPaid(hasPaid);

      if (!hasPaid) {
        setErrorMessage("You need to pay to upgrade your plan.");
        setButtonText("Pay to Upgrade");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      // setErrorMessage("An error occurred while checking the payment status. Please try again later.");
    }
  };

  useEffect(() => {
    checkPaymentStatus(); 
  }, []);

  const handleUpgradeClick = () => {
    if (!isPaid) {
      setShowPaymentModal(true); 
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      // Proceed with the upgrade logic 
      console.log("Upgrading plan...");
      setIsModalOpen(false); 
    } catch (error) {
      setErrorMessage("An error occurred during the upgrade process. Please try again later.");
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
    setButtonText("Upgrade Now");
    handleUpgradeClick();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="mx-auto bg-white p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Upgrade Plan</h2>
        <p className="text-gray-700 mb-4">
          Choose a new plan to unlock additional features.
        </p>
        <div className="text-center">
          <button
            onClick={handleUpgradeClick}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Processing..." : buttonText}
          </button>
        </div>
        {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={1000}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Modal>
  );
}

UpgradePlanModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default UpgradePlanModal;