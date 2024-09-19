import { useState } from "react";

import game1 from "../assets/gameThumbnail/game1.png";
import game2 from "../assets/gameThumbnail/game2.png";
import game3 from "../assets/gameThumbnail/game3.png";
import game4 from "../assets/gameThumbnail/game4.png";

import "./GameList.css";

const GameList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const gameItems = [
    { type: "game1", image: game1 },
    { type: "game2", image: game2 },
    { type: "game3", image: game3 },
    { type: "game4", image: game4 },
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gameItems.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === gameItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="GameListContainer">
      <button onClick={handlePrevClick}>위로</button>
      <div className="GameList">
        {/* currentIndex - 1이 0보다 작을 때 마지막 인덱스로 설정 */}
        <div>
          <img
            className="GameThumbnail"
            src={
              currentIndex === 0
                ? gameItems[gameItems.length - 1].image
                : gameItems[currentIndex - 1].image
            }
            alt={
              currentIndex === 0
                ? gameItems[gameItems.length - 1].type
                : gameItems[currentIndex - 1].type
            }
          />
        </div>
        <div>
          <img
            className="GameThumbnail"
            alt={gameItems[currentIndex].type}
            src={gameItems[currentIndex].image}
          />
        </div>
        <div>
          <img
            className="GameThumbnail"
            src={
              currentIndex === gameItems.length - 1
                ? gameItems[0].image
                : gameItems[currentIndex + 1].image
            }
            alt={
              currentIndex === gameItems.length - 1
                ? gameItems[0].type
                : gameItems[currentIndex + 1].type
            }
          />
        </div>
      </div>
      <button onClick={handleNextClick}>아래로</button>
    </div>
  );
};

export default GameList;
