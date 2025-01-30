import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Download = () => {
  // const [downloadedFiles, setDownloadedFiles] = useState([]);

  // useEffect(() => {
  //   fetchDownloadHistory();
  // }, []);

  // const fetchDownloadHistory = async () => {
  //   try {
  //     const response = await axios.get('/api/downloads');
  //     setDownloadedFiles(response.data);
  //   } catch (error) {
  //     console.error('Error fetching download history:', error);
  //   }
  // };

  const downloadedFiles = [
    { id: 1, fileName: 'File1.pdf', downloadDate: '2025-01-14', fileUrl: '/files/file1.pdf' },
    { id: 2, fileName: 'File2.pdf', downloadDate: '2025-01-13', fileUrl: '/files/file2.pdf' },
  ];

  return (
    <div className="lg:px-16 p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Download History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloadedFiles.map((file) => (
          <div key={file.id} className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold">{file.fileName}</h2>
            <p className="text-gray-600">Downloaded on: {file.downloadDate}</p>
            <a
              href={file.fileUrl}
              download
              className="text-blue-500 hover:underline mt-2 block"
            >
              Download Again
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Download;