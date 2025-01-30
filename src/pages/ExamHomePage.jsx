import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DownloadButton from "../components/DownloadButton";
import PdfViewer from "../components/PdfViewer";
import apiService from "../constants/data";

const ExamHomePage = () => {
  const { examType, subject, year } = useParams();
  const [examDetails, setExamDetails] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        // Replace "exams" with the appropriate API endpoint
        const data = await apiService.getOne(`exams/${examType}/${subject}/${year}`);
        setExamDetails(data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExamDetails();
  }, [examType, subject, year]);

  if (!examDetails) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div> {/* Add your loader component or animation */}
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 bg-gray-100">
      {/* Display the exam title */}
      <div className="p-4 rounded-md">
        <h2 className="text-xl font-bold">{examDetails.title}</h2>
      </div>

      {/* PdfViewer Component */}
      <PdfViewer
        type="exams"
        typeDisplay={`${subject.toUpperCase()} Exam`}
        id={examDetails.id}
        initialPageNumber={1}
      />

      {/* Download Button */}
      <div className="mt-6 flex justify-center">
        <DownloadButton
          pdfUrl={examDetails.pdf_document}
          id={examDetails.id}
          amount={parseFloat(examDetails.price)}
          label="Download PDF"
          type="exams"
        />
      </div>
    </div>
  );
};

export default ExamHomePage;