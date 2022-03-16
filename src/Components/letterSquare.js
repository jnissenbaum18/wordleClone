import "./letterSquare.css";

function LetterSquare({ letter, status }) {
  return (
    <div className={`letter-square-container`}>
      <div
        className={`letter-${status}`}
      >
        {letter}
      </div>
    </div>
  );
}

export default LetterSquare;
