import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import DownloadButton from '../../components/DownloadButton';
import PdfViewer from '../../components/PdfViewer';
import apiService from '../../constants/data';

const ExamPage = () => {
    const {id} = useParams();
    const [examDetails, setExamDetails] = useState(null);

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const data = await apiService.getOne('exams', id);
                setExamDetails(data);
            } catch (error) {
                console.error(`Error fetching exam details:`, error);
            }
        };

        fetchExamDetails();
    }, [id]);

    if (!examDetails) {
        return (
            <div className="flex-grow justify-items-center content-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow p-6 bg-gray-100">
            {/* PdfViewer */}
            {examDetails && (
                <PdfViewer type="exams" typeDisplay="Exam" id={examDetails.id} initialPageNumber={1}/>
            )}

            {/* Download Button */}
            <DownloadButton
                pdfUrl={examDetails.pdf_document}
                id={examDetails.id}
                amount={parseFloat(examDetails.price)}
                label="Download PDF"
                type="exams"
            />
        </div>
    );
};

export default ExamPage;