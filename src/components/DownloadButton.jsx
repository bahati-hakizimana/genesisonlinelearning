import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import apiService from '../constants/data';
import PaymentModal from './PaymentModal';
import axios from 'axios';

const DownloadButton = ({pdfUrl, id, amount, label, type}) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState(label || "Download PDF");

    const typeToModelMap = {
        notes: "note",
        exams: "exam",
        books: "book",
    };

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                console.log('Fetching download history...');
                const downloadHistory = await apiService.getAll('download_history');
                console.log('Download history:', downloadHistory);

                const model = typeToModelMap[type];
                const hasPaid = downloadHistory.some(item => item.content_type.model === model && item.object_id === id);
                setIsPaid(hasPaid);

                if (!hasPaid) {
                    console.log('User has not paid for this document.');
                    setErrorMessage("You need to pay to download this full document.");
                    setButtonText("Pay to Download");
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setErrorMessage("An error occurred while checking the payment status. Please try again later.");
            }
        };

        checkPaymentStatus();
    }, [id, type]);

    const handleDownloadClick = async () => {
        if (!isPaid) {
            setErrorMessage("You need to pay to download this full document.");
            setShowPaymentModal(true);
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            let url = pdfUrl;
            if (!url) {
                const response = await apiService.downloadPdf(type, id);
                if (response.detail === "Authentication credentials were not provided.") {
                    setErrorMessage("You need to be logged in to download this document.");
                    setLoading(false);
                    return;
                } else if (response.url) {
                    url = response.url;
                }
            }

            // Prepend the base URL if not already included
            if (!url.startsWith(apiService.baseUrl)) {
                url = `${apiService.baseUrl}${url}`;
            }

            const downloadResponse = await axios.get(url, {responseType: 'blob'});
            if (downloadResponse.status === 403) {
                setErrorMessage("You need to pay to download this full document.");
                setShowPaymentModal(true);
                setLoading(false);
                return;
            }

            const downloadUrl = window.URL.createObjectURL(new Blob([downloadResponse.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Extract the filename from the URL
            const filename = url.split('/').pop();
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the document:', error);
            if (error.response && error.response.status === 403) {
                setErrorMessage("You need to pay to download this full document.");
                setShowPaymentModal(true);
            } else {
                setErrorMessage("An error occurred while downloading the document. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaid(true);
        setShowPaymentModal(false);
        setButtonText(label || "Download PDF");
        handleDownloadClick();
    };

    if (!pdfUrl && !id) return null;

    return (
        <div className="mt-6 text-center">
            <button
                onClick={handleDownloadClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                disabled={loading}
            >
                {loading ? "Loading..." : buttonText}
            </button>
            {showPaymentModal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    amount={amount}
                    onSuccess={handlePaymentSuccess}
                />
            )}
            {errorMessage && (
                <div className="mt-4 text-red-600">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

DownloadButton.propTypes = {
    pdfUrl: PropTypes.string,
    id: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
};

export default DownloadButton;