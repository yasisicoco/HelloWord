import Button from "./Button";

import "./ButtonList.css";

const ButtonList = () => {
  return (
    <div className="ButtonList">
      <div className="Button">
        <Button />
      </div>
      <div className="Button">
        <Button />
      </div>
      <div className="Button">
        <Button />
      </div>
    </div>
  );
};

export default ButtonList;
