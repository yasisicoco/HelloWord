import { useState } from "react";

import "./ExpGage.css";

const ExpGage = () => {
  const [exp, setExp] = useState(50);

  return (
    <div className="exp-container">
      <div className="exp-bar" style={{ width: `${exp}%` }}>
        {exp}%
      </div>
    </div>
  );
};

export default ExpGage;
