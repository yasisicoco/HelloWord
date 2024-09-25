import './Button.sass';

const Button = ({ img }) => {
  return (
    <>
      <img src={img} alt="button icon" className="button__img" />
    </>
  );
};

export default Button;
