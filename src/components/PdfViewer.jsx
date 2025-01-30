import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import apiService from '../constants/data.js';

const PdfViewer = ({type, typeDisplay, id, initialPageNumber}) => {
    const [imageData, setImageData] = useState(null);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({
        title: 'Loading...',
        total_pages: 1
    });
    const [inputPageNumber, setInputPageNumber] = useState(initialPageNumber);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await apiService.getOne(type, id);
                setDetails(data);
            } catch (error) {
                console.error(`Error fetching ${type} details:`, error);
            }
        };

        fetchDetails();
    }, [type, id]);

    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            try {
                const data = await apiService.viewPdfPage(type, id, pageNumber);
                const imageUrl = URL.createObjectURL(data);
                setImageData(imageUrl);
            } catch (error) {
                console.error(`Error fetching image for ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [type, id, pageNumber]);

    useEffect(() => {
        setInputPageNumber(pageNumber);
    }, [pageNumber]);

    const handleNextPage = () => {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, details.total_pages));
    };

    const handlePreviousPage = () => {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    };

    const handleInputChange = (event) => {
        setInputPageNumber(Number(event.target.value));
    };

    const handleJumpToPage = () => {
        if (inputPageNumber >= 1 && inputPageNumber <= details.total_pages) {
            setPageNumber(inputPageNumber);
        }
    };

    return (
        <div className="flex-grow p-6 bg-gray-100">
            {details && (
                <div className="text-center mt-4">
                    <h2 className="text-4xl font-bold text-center text-[#4175B7] mb-6">{details.title} {typeDisplay}</h2>
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <input
                            type="number"
                            value={inputPageNumber}
                            onChange={handleInputChange}
                            min="1"
                            max={details ? details.total_pages : 1}
                            className="w-16 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleJumpToPage}>Go
                        </button>
                    </div>
                </div>
            )}
            <div className="p-6 flex flex-col">
                <div className="border bg-white min-h-full flex-grow justify-items-center content-center">
                    {loading ? (
                        <div className="loader"></div>
                    ) : (
                        imageData && (
                            <img
                                src={imageData}
                                alt={`Page ${pageNumber}`}
                                width="100%"
                                height="600px"
                                style={{
                                    userSelect: 'none',
                                    pointerEvents: 'none',
                                    userDrag: 'none'
                                }}
                            />
                        )
                    )}
                </div>
                <div className="flex justify-between my-4">
                    <button className="bg-blue-600 py-1 px-4 rounded text-white" onClick={handlePreviousPage}
                            disabled={pageNumber === 1}>Previous
                    </button>
                    <div className="text-center">
                        <p className="text-lg text-gray-600">Page {pageNumber} of {details.total_pages}</p>
                    </div>
                    <button className="bg-blue-600 py-1 px-4 rounded text-white" onClick={handleNextPage}
                            disabled={pageNumber === details.total_pages}>Next
                    </button>
                </div>
            </div>
        </div>
    );
};

PdfViewer.propTypes = {
    type: PropTypes.string.isRequired,
    typeDisplay: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    initialPageNumber: PropTypes.number.isRequired
};

export default PdfViewer;