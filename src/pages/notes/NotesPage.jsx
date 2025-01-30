import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import DownloadButton from '../../components/DownloadButton';
import PdfViewer from '../../components/PdfViewer.jsx';
import apiService from '../../constants/data';

const NotesPage = () => {
    const {id} = useParams();
    const [noteDetails, setNoteDetails] = useState(null);

    useEffect(() => {
        const fetchNoteDetails = async () => {
            try {
                const data = await apiService.getOne('notes', id);
                setNoteDetails(data);
            } catch (error) {
                console.error(`Error fetching note details:`, error);
            }
        };

        fetchNoteDetails();
    }, [id]);

    if (!noteDetails) {
        return (
            <div className="flex-grow justify-items-center content-center">
                <div className="loader"></div>
            </div>
        );
    }

    const embedUrl = noteDetails.video_url.replace("watch?v=", "embed/");

    return (
        <div className="flex-grow bg-gray-100">
            {noteDetails && (
                <div className="mt-6">
                    <PdfViewer type="notes" typeDisplay="Notes" id={noteDetails.id} initialPageNumber={1}/>
                    <DownloadButton
                        pdfUrl={noteDetails.pdf_document}
                        id={noteDetails.id}
                        amount={parseFloat(noteDetails.price)}
                        label="Download PDF"
                        type="notes"
                    />
                </div>
            )}

            <div
                className="bg-white shadow-lg rounded-lg p-6 m-12"
                style={{
                    userSelect: 'none',
                }}
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Video Content</h2>
                    <iframe
                        width="100%"
                        height="400"
                        src={embedUrl}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default NotesPage;