import { create } from "zustand";

import Square from "./Square";
import "./index.css";
import { combine } from "zustand/middleware";

const useGameStore = create(
  combine({ squares: Array(9).fill(null), xTurn: true }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === "function"
              ? nextSquares(state.squares)
              : nextSquares,
        }));
      },

      setXTurn: (nextTurn) => {
        set((state) => ({
          xTurn:
            typeof nextTurn === "function" ? nextTurn(state.xTurn) : nextTurn,
        }));
      },
    };
  })
);

const calculateWinner = (squares) => {
  const winningCases = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCases.length; i++) {
    const [a, b, c] = winningCases[i];

    // 세칸 모두가 X 또는 O가 채워져있고, 모두 같은 사람일 때 승패가 가려짐
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a]; // 해당 플레이어를 return
    }
  }
};

const calculateRemainingTurns = (squares) => {
  const nullSqaure = squares.filter((square) => !square);

  return nullSqaure.length;
};

// 비기는 경우를 위해 필요한 함수
const calculateStatus = (winner, turns, player) => {
  if (!winner && !turns) return "Draw!!!";
  if (winner) return `Winner ${winner}`;
  return `Next Player: ${player}`;
};

const Board = () => {
  const squares = useGameStore((state) => state.squares);
  const setSquares = useGameStore((state) => state.setSquares);

  const xTurn = useGameStore((state) => state.xTurn);
  const setXTurn = useGameStore((state) => state.setXTurn);

  const player = xTurn ? "X" : "O";
  const winner = calculateWinner(squares);
  const turns = calculateRemainingTurns(squares);
  const gameStatus = calculateStatus(winner, turns, player);

  console.log("Square state array: ", squares);
  console.log("Whose Turn? ", player);
  console.log("Winner: ", winner);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const nextSqaures = squares.slice();
    nextSqaures[i] = player;
    setSquares(nextSqaures);
    setXTurn(!xTurn);
  };

  return (
    <>
      <div style={{ marginBottom: "0.5rem" }}>{gameStatus}</div>
      <div className="board">
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  );
};

export default Board;
