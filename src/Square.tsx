import "./index.css";

type square = {
  value: string;
  onSquareClick?: () => void;
};

const Square = ({ value, onSquareClick }: square) => {
  return (
    <button onClick={onSquareClick} className="square">
      {value}
    </button>
  );
};

export default Square;
