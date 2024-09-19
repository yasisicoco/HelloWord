import GameList from "../components/GameList";
import CharacterExpButtonGroup from "../components/CharacterExpButtonGroup";

import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <CharacterExpButtonGroup />
      <GameList />
    </div>
  );
};

export default Home;
