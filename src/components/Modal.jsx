import PropTypes from "prop-types";

function Modal({isOpen, onClose, children}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div
                className="bg-white max-w-sm max-h-[90vh] overflow-auto lg:max-w-md w-full p-8 rounded-3xl shadow-lg z-10 relative">
                <button
                    onClick={onClose}
                    className="absolute rounded-full w-8 h-8 text-center text-2xl bg-gray-500 top-3 right-3 text-white hover:bg-gray-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;