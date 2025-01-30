import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import apiService from "../constants/data";

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }
    if (!firstname || !lastname || !email) {
      setError("Please fill in all required personal details.");
      setLoading(false);
      return;
    }

    try {
      const paymentData = {
        firstname,
        lastname,
        email,
        phone: phoneNumber,
        amount,
      };

      // Make the initial payment request
      const paymentResponse = await apiService.makePaymentRequest(paymentData);

      if (paymentResponse.status === 201) {
        // Payment initiated successfully, now wait for confirmation
        await receivePaymentConfirmation(paymentResponse.id);
      } else if (paymentResponse.status === "pending") {
        setPendingModalOpen(true);
      } else {
        setFailureModalOpen(true);
        setError("Payment could not be initiated. Please try again.");
      }
    } catch (err) {
      setFailureModalOpen(true);
      setError("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const receivePaymentConfirmation = async (id) => {
    try {
      const confirmationResponse = await apiService.receivePayment({ id });

      if (confirmationResponse.status === "success") {
        setSuccessModalOpen(true);
        downloadBook(id);
        onSuccess();
      } else if (confirmationResponse.status === "pending") {
        setPendingModalOpen(true);
      } else {
        setFailureModalOpen(true);
        setError(confirmationResponse.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      setFailureModalOpen(true);
      setError("An error occurred while receiving payment confirmation. Please try again.");
    }
  };

  const downloadBook = async (id) => {
    try {
      const downloadResponse = await apiService.downloadBook(id);

      if (downloadResponse.status === 200) {
        const blob = await downloadResponse.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "book.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError("Failed to download the book. Please try again.");
      }
    } catch (err) {
      console.error("Error downloading book:", err);
      setError("An error occurred while downloading the book. Please try again.");
    }
  };

  return (
    <>
      {/* Main Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-lg font-bold text-center text-yellow-600 mb-6">Pay with MTN/Airtel</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            {/* Personal Details */}
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter your first name"
                required
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
            </div>
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter your last name"
                required
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">Amount:</label>
              <span className="text-sm font-semibold text-yellow-600">{amount}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-green-600 font-bold text-lg">Payment Successful</h2>
          <p className="text-gray-700 mt-2">Thank you for your payment! Your book is ready for download.</p>
          <button
            onClick={() => {
              setSuccessModalOpen(false);
              onClose();
            }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Failure Modal */}
      <Modal isOpen={failureModalOpen} onClose={() => setFailureModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-red-600 font-bold text-lg">Payment Failed</h2>
          <p className="text-gray-700 mt-2">An error occurred. Please try again.</p>
          <button
            onClick={() => setFailureModalOpen(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Pending Modal */}
      <Modal isOpen={pendingModalOpen} onClose={() => setPendingModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-yellow-600 font-bold text-lg">Payment Pending</h2>
          <p className="text-gray-700 mt-2">
            A code has been sent to your phone. Please check your phone and confirm the payment.
          </p>
          <button
            onClick={() => setPendingModalOpen(false)}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;