import "./letterSquare.css";

function LetterSquare({ letter, status }) {
  return (
    <div className={`letter-square-container letter-${status}`}>
        {letter}
    </div>
  );
}

export default LetterSquare;
