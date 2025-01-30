import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../constants/data.js";
import Loading from "../../components/Loading.jsx";
import Error from "../../components/Error.jsx";
import Button from "../../components/Button";

const Books = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState("");
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevelsClassesAndBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedLevels = await apiService.getAll("levels");
        const fetchedBooks = await apiService.getAll("books");

        const levelsData = fetchedLevels.reduce((acc, level) => {
          acc[level.name] = {
            id: level.id,
            title: `${level.name} Books`,
            classes: {},
          };
          return acc;
        }, {});

        fetchedBooks.forEach((book) => {
          if (levelsData[book.level]) {
            if (!levelsData[book.level].classes[book.class_name]) {
              levelsData[book.level].classes[book.class_name] = {
                title: `${book.class_name} Books`,
                books: [],
              };
            }
            levelsData[book.level].classes[book.class_name].books.push(book);
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

    fetchLevelsClassesAndBooks();
  }, []);

  const handleBookClick = (book) => {
    navigate(`/books-content/${book.id}`);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const currentLevelData = levels[currentLevel];
  const sortedLevels = Object.keys(levels).sort(
    (a, b) => levels[a].id - levels[b].id
  );

  const getClassBackgroundColor = (className) => {
    switch (className) {
      case "Senior 1":
        return "bg-green-100";
      case "Senior 2":
        return "bg-green-50"; 
      case "Senior 3":
        return "bg-green-20"; 
      case "Senior 4":
        return "bg-green-100"; 
      case "Senior 5":
        return "bg-green-50"; 
      case "Senior 6":
        return "bg-green-20"; 
      default:
        return "bg-gray-200"; 
    }
  };

  return (
    <div className="p-4 min-h-screen">
      {/* Books Section */}
      <div className="bg-green-200 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center">BOOKS</h2>
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
                    No books found for this level.
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
                          {currentLevelData.classes[className].books.map(
                            (book) => (
                              <div
                                key={book.id}
                                onClick={() => handleBookClick(book)}
                                className="relative"
                              >
                               
                                <Button label={book.title.toUpperCase()} />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-700">
              Please select a level to view books.
            </div>
          )}
        </div>
      </div>

      {loading && <Loading />}
      {error && <Error message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default Books;