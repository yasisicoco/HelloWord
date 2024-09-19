import ExpGage from "./ExpGage";
import Character from "./character";
import ButtonList from "./ButtonList";

import "./CharacterExpButtonGroup.css";

const CharacterExpButtonGroup = () => {
  return (
    <div className="CharacterExpButtonGroup">
      <ExpGage />
      <Character />
      <ButtonList />
    </div>
  );
};

export default CharacterExpButtonGroup;
