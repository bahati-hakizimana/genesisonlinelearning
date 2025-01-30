import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import DownloadButton from '../../components/DownloadButton';
import PdfViewer from '../../components/PdfViewer';
import apiService from '../../constants/data';

const BooksPage = () => {
    const {id} = useParams();
    const [bookDetails, setBookDetails] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const data = await apiService.getOne('books', id);
                setBookDetails(data);
            } catch (error) {
                console.error(`Error fetching book details:`, error);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (!bookDetails) {
        return (
            <div className="flex-grow justify-items-center content-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow p-6 bg-gray-100">
            {/* PdfViewer */}
            {bookDetails && (
                <PdfViewer type="books" typeDisplay="Book" id={bookDetails.id} initialPageNumber={1}/>
            )}

            {/* Download Button */}
            <DownloadButton
                pdfUrl={bookDetails.pdf_document}
                id={bookDetails.id}
                amount={parseFloat(bookDetails.price)}
                label="Download PDF"
                type="books"
            />
        </div>
    );
};

export default BooksPage;