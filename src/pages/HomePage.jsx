import {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import apiService from "../constants/data";
import Loading from "../components/Loading";

const Homepage = () => {
    const navigate = useNavigate();
    const [examSeriesTab, setExamSeriesTab] = useState("");
    const [regionalExamTab, setRegionalExamTab] = useState("");
    const [secondarySubjectNotesTab, setSecondarySubjectNotesTab] = useState("");
    const [examSeriesData, setExamSeriesData] = useState({});
    const [regionalExamData, setRegionalExamData] = useState({});
    const [subjectNotesData, setSubjectNotesData] = useState({});
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [examSeriesDropdownOpen, setExamSeriesDropdownOpen] = useState({});
    const [regionalExamDropdownOpen, setRegionalExamDropdownOpen] = useState({});
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setExamSeriesDropdownOpen({});
                setRegionalExamDropdownOpen({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const exams = await apiService.getAll("exams");
                const notes = await apiService.getAll("notes");
                const classesData = await apiService.getAll("classes");

                setClasses(classesData);

                const examData = classesData.reduce((acc, cls) => {
                    const filteredExams = exams.filter((exam) => exam.lesson.class_assigned === cls.id);
                    const nationalExams = filteredExams.filter((exam) => exam.exam_type === "national");
                    const preNationalExams = filteredExams.filter((exam) => exam.exam_type === "pre_national");

                    if (preNationalExams.length > 0 || nationalExams.length > 0) {
                        acc[cls.name] = {
                            pre_national: preNationalExams,
                            national: nationalExams,
                        };
                    }
                    return acc;
                }, {});

                setExamSeriesData({
                    "Senior 3": examData["Senior 3"]?.national || [],
                    "Senior 6": examData["Senior 6"]?.national || [],
                });

                setRegionalExamData({
                    "Senior 1": examData["Senior 1"]?.pre_national || [],
                    "Senior 2": examData["Senior 2"]?.pre_national || [],
                    "Senior 4": examData["Senior 4"]?.pre_national || [],
                    "Senior 5": examData["Senior 5"]?.pre_national || [],
                });

                const notesData = classesData.reduce((acc, cls) => {
                    const filteredNotes = notes.filter((note) => note.lesson.class_assigned === cls.id);
                    acc[cls.name] = filteredNotes;
                    return acc;
                }, {});

                setSubjectNotesData(notesData);

                setExamSeriesTab("Senior 3");
                setRegionalExamTab("Senior 1");
                setSecondarySubjectNotesTab(classesData[0]?.name || "");

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleDropdown = (setDropdownState, dropdownState, subject) => {
        setDropdownState((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => ({...acc, [key]: false}), {}),
            [subject]: !dropdownState[subject],
        }));
    };

    const handleYearSelection = (examId) => {
        navigate(`/exam-content/${examId}`);
    };

    if (loading) {
        return (
            <div className="flex-grow justify-items-center content-center">
                <Loading/>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen" ref={dropdownRef}>
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Secondary National Exams */}
            <div className="bg-green-200 mt-8 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center">SECONDARY NATIONAL EXAMS</h2>
                <div className="flex space-x-2 border-b pb-2 justify-start overflow-x-auto">
                    {Object.keys(examSeriesData).map((tab) => (
                        <button
                            key={tab}
                            className={`py-1 px-3 text-sm font-semibold rounded-t-md ${
                                examSeriesTab === tab ? "bg-white text-blue-500 border-t border-l border-r" : "text-gray-600"
                            }`}
                            onClick={() => setExamSeriesTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="bg-green-100 p-4 rounded-b-md shadow-md">
                    <h3 className="text-md font-semibold mb-4 text-center">{examSeriesTab.toUpperCase()} EXAMS</h3>
                    {examSeriesData[examSeriesTab]?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {Object.values(examSeriesData[examSeriesTab].reduce((acc, exam) => {
                                if (!acc[exam.lesson.display]) {
                                    acc[exam.lesson.display] = [];
                                }
                                acc[exam.lesson.display].push(exam);
                                return acc;
                            }, {})).map((exams) => (
                                <div key={exams[0].lesson.display} className="relative">
                                    <button
                                        className="py-2 px-3 text-xs sm:text-sm bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 flex justify-between items-center"
                                        onClick={() => toggleDropdown(setExamSeriesDropdownOpen, examSeriesDropdownOpen, exams[0].lesson.display)}
                                    >
                                        {exams[0].lesson.display.toUpperCase()} <span className="ml-7">▼</span>
                                    </button>
                                    <div>
                                        {examSeriesDropdownOpen[exams[0].lesson.display] && (
                                            <div
                                                className="absolute top-10 left-0 w-full bg-white border rounded-lg shadow-lg z-10">
                                                {exams.map((exam) => (
                                                    <div key={exam.id}
                                                         className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                                         onClick={() => handleYearSelection(exam.id)}>
                                                        {exam.year}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No exams available for this class.</p>
                    )}
                </div>
            </div>

            {/* Secondary Pre-National Exams */}
            <div className="bg-green-200 mt-8 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center">SECONDARY PRE-NATIONAL EXAMS</h2>
                <div className="flex space-x-2 border-b pb-2 justify-start overflow-x-auto">
                    {Object.keys(regionalExamData).map((tab) => (
                        <button
                            key={tab}
                            className={`py-1 px-3 text-sm font-semibold rounded-t-md ${
                                regionalExamTab === tab ? "bg-white text-blue-500 border-t border-l border-r" : "text-gray-600"
                            }`}
                            onClick={() => setRegionalExamTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="bg-green-100 p-4 rounded-b-md shadow-md">
                    <h3 className="text-md font-semibold mb-4 text-center">{regionalExamTab.toUpperCase()} EXAMS</h3>
                    {regionalExamData[regionalExamTab]?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {Object.values(regionalExamData[regionalExamTab].reduce((acc, exam) => {
                                if (!acc[exam.lesson.display]) {
                                    acc[exam.lesson.display] = [];
                                }
                                acc[exam.lesson.display].push(exam);
                                return acc;
                            }, {})).map((exams) => (
                                <div key={exams[0].lesson.display} className="relative">
                                    <button
                                        className="py-2 px-3 text-xs sm:text-sm bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 flex justify-between items-center"
                                        onClick={() => toggleDropdown(setRegionalExamDropdownOpen, regionalExamDropdownOpen, exams[0].lesson.display)}
                                    >
                                        {exams[0].lesson.display.toUpperCase()} <span className="ml-7">▼</span>
                                    </button>
                                    {regionalExamDropdownOpen[exams[0].lesson.display] && (
                                        <div
                                            className="absolute top-10 left-0 w-full bg-white border rounded-lg shadow-lg z-10">
                                            {exams.map((exam) => (
                                                <div key={exam.id}
                                                     className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                                     onClick={() => handleYearSelection(exam.id)}>
                                                    {exam.year}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No exams available for this class.</p>
                    )}
                </div>
            </div>

            {/* Secondary Subject Notes */}
            <div className="bg-green-200 mt-8 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center">SECONDARY SUBJECT NOTES</h2>
                <div className="flex space-x-2 border-b pb-2 justify-start overflow-x-auto">
                    {classes.map((cls) => (
                        <button
                            key={cls.id}
                            className={`py-1 px-3 text-sm font-semibold rounded-t-md ${
                                secondarySubjectNotesTab === cls.name ? "bg-white text-blue-500 border-t border-l border-r" : "text-gray-600"
                            }`}
                            onClick={() => setSecondarySubjectNotesTab(cls.name)}
                        >
                            {cls.name.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="bg-green-100 p-4 rounded-b-md shadow-md">
                    <h3 className="text-md font-semibold mb-4 text-center">{secondarySubjectNotesTab.toUpperCase()} SUBJECT
                        NOTES</h3>
                    {subjectNotesData[secondarySubjectNotesTab]?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {subjectNotesData[secondarySubjectNotesTab].map((note) => (
                                <div
                                    key={note.id}
                                    className="py-2 px-3 text-xs sm:text-sm bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 cursor-pointer"
                                    onClick={() => navigate(`/notes-content/${note.id}`)}
                                >
                                    {note.lesson.display.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No notes available for this class.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;