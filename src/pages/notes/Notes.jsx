import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import apiService from "../../constants/data.js";
import Loading from "../../components/Loading.jsx";
import Error from "../../components/Error.jsx";

const Notes = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState("");
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevelsClassesAndNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedLevels = await apiService.getAll("levels");
        const fetchedNotes = await apiService.getAll("notes");

        const levelsData = fetchedLevels.reduce((acc, level) => {
          acc[level.name] = {
            id: level.id,
            title: `${level.name} Notes`,
            classes: {},
          };
          return acc;
        }, {});

        fetchedNotes.forEach((note) => {
          if (levelsData[note.level]) {
            if (!levelsData[note.level].classes[note.class_name]) {
              levelsData[note.level].classes[note.class_name] = {
                title: `${note.class_name} Notes`,
                notes: [],
              };
            }
            levelsData[note.level].classes[note.class_name].notes.push(note);
          }
        });

        setLevels(levelsData);

        const sortedLevels = Object.keys(levelsData).sort(
          (a, b) => levelsData[a].id - levelsData[b].id
        );
        if (sortedLevels.length > 0) {
          setCurrentLevel(sortedLevels[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelsClassesAndNotes();
  }, []);

  const handleNoteClick = (note) => {
    navigate(`/notes-content/${note.id}`);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const currentLevelData = levels[currentLevel];

  const sortedLevels = Object.keys(levels).sort(
    (a, b) => levels[a].id - levels[b].id
  );

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
      <div className="bg-green-200 p-4 rounded-md shadow-md">
        <h1 className="text-lg font-bold mb-4 text-center">
          NOTES
        </h1>

        {/* Level Tabs */}
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

        {/* Notes Content */}
        <div className="bg-white p-4 rounded-b-md shadow-md mt-4">
          {loading && <Loading />}
          {error && <Error message={error} onClose={() => setError(null)} />}

          {currentLevelData ? (
            Object.keys(currentLevelData.classes).length === 0 ? (
              <div className="text-center text-gray-700">
                No notes found for this level.
              </div>
            ) : (
              Object.keys(currentLevelData.classes)
                .sort()
                .map((className) => (
                  <div
                    key={className}
                    className={`mb-10 p-4 rounded-md shadow-md ${getClassBackgroundColor(
                      className
                    )}`}
                  >
                    <h2 className="text-md font-semibold mb-4 text-center">
                      {className.toUpperCase()}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {currentLevelData.classes[className].notes.map(
                        (note) => (
                          <div
                            key={note.id}
                            onClick={() => handleNoteClick(note)}
                            className="relative"
                          >
                            <Button
                              label={note.title.toUpperCase()}
                              className="w-full py-2 px-3 text-xs sm:text-sm bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 flex justify-between items-center"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))
            )
          ) : (
            <div className="text-center text-gray-700">
              Please select a level to view notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;