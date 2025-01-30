import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import apiService from "../../constants/data.js";
import Loading from "../../components/Loading.jsx";
import Error from "../../components/Error.jsx";

const Exams = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(""); 
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showYearSelector, setShowYearSelector] = useState(false);

  useEffect(() => {
    const fetchLevelsClassesAndExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedLevels = await apiService.getAll("levels");
        const fetchedExams = await apiService.getAll("exams");

        const levelsData = fetchedLevels.reduce((acc, level) => {
          acc[level.name] = {
            id: level.id,
            title: `${level.name} Exams`,
            classes: {},
          };
          return acc;
        }, {});

        fetchedExams.forEach((exam) => {
          if (levelsData[exam.level]) {
            if (!levelsData[exam.level].classes[exam.class_name]) {
              levelsData[exam.level].classes[exam.class_name] = {
                title: `${exam.class_name} Exams`,
                lessons: {},
              };
            }
            if (!levelsData[exam.level].classes[exam.class_name].lessons[exam.lesson.title]) {
              levelsData[exam.level].classes[exam.class_name].lessons[exam.lesson.title] = {
                title: exam.lesson.title,
                exams: [],
              };
            }
            levelsData[exam.level].classes[exam.class_name].lessons[exam.lesson.title].exams.push(exam);
          }
        });

        setLevels(levelsData);

        const sortedLevels = Object.keys(levelsData).sort((a, b) => levelsData[a].id - levelsData[b].id);
        if (sortedLevels.length > 0) {
          setCurrentLevel(sortedLevels[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelsClassesAndExams();
  }, []);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowYearSelector(true);
  };

  const handleYearSelection = (exam) => {
    setShowYearSelector(false);
    navigate(`/exam-content/${exam.id}`);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const currentLevelData = levels[currentLevel];
  const sortedLevels = Object.keys(levels).sort((a, b) => levels[a].id - levels[b].id);

  // Function to get the background color for classes
  const getClassBackgroundColor = (className) => {
    switch (className) {
      case "Senior 1":
        return "bg-green-100";
      case "Senior 2":
        return "bg-green-80"; 
      case "Senior 3":
        return "bg-green-50"; 
      case "Senior 4":
        return "bg-green-100"; 
      case "Senior 5":
        return "bg-green-80"; 
      case "Senior 6":
        return "bg-green-50"; 
      default:
        return "bg-gray-200"; 
    }
  };

  return (
    <div className="p-4 min-h-screen">
      {/* Exams Section */}
      <div className="bg-green-200 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center">EXAMS</h2>
        <div className="flex space-x-2 border-b pb-2 justify-start overflow-x-auto">
          {sortedLevels.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`py-1 px-3 text-sm font-semibold rounded-t-md ${
                currentLevel === level
                  ? "bg-white text-blue-500 border-t border-l border-r"
                  : "text-gray-600"
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="bg-white p-4 rounded-b-md shadow-md">
          {currentLevelData ? (
            <>
              <h3 className="text-md font-semibold mb-4 text-center">
                {currentLevelData.title.toUpperCase()}
              </h3>
              <div className="flex flex-col gap-6">
                {Object.keys(currentLevelData.classes).length === 0 ? (
                  <div className="text-center text-gray-700 col-span-full">
                    No exams found for this level.
                  </div>
                ) : (
                  Object.keys(currentLevelData.classes)
                    .sort()
                    .map((className) => (
                      <div
                        key={className}
                        className={`flex flex-col items-start mb-6 p-4 rounded-md shadow-md ${getClassBackgroundColor(
                          className
                        )}`}
                      >
                        <h4 className="text-center font-bold mb-2">
                          {className.toUpperCase()}
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {Object.keys(currentLevelData.classes[className].lessons).map((lessonTitle) => {
                            const lesson = currentLevelData.classes[className].lessons[lessonTitle].exams[0].lesson;
                            return (
                              <div
                                key={lessonTitle}
                                onClick={() => handleLessonClick(currentLevelData.classes[className].lessons[lessonTitle])}
                                className="relative"
                              >
                                <Button label={lesson.display.toUpperCase()} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-700">
              Please select a level to view exams.
            </div>
          )}
        </div>
      </div>

      {showYearSelector && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Select Year</h2>
            <div className="grid grid-cols-3 gap-4">
              {selectedLesson.exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleYearSelection(exam)}
                  className="bg-[#4175B7] text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  {exam.year}
                </button>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowYearSelector(false)}
                className="text-gray-500 hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <Loading />}
      {error && <Error message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default Exams;