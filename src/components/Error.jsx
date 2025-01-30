const Error = ({ message, onClose }) => (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
        <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                &times;
            </button>
        </div>
    </div>
);

export default Error;