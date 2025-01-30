import PropTypes from "prop-types";
import Modal from "../../components/Modal";

function BillingManagementModal({ isModalOpen, setIsModalOpen }) {
  const handleBillingUpdate = () => {
    // Logic for updating billing
    console.log("Managing billing...");
    setIsModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="mx-auto bg-white p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Manage Billing
        </h2>
        <p className="text-gray-700 mb-4">
          Update your payment methods or view your billing history.
        </p>
        <div className="text-center">
          <button
            onClick={handleBillingUpdate}
            className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-500"
          >
            Update Billing
          </button>
        </div>
      </div>
    </Modal>
  );
}

BillingManagementModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default BillingManagementModal;