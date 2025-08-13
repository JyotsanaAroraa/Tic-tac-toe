import { useState } from 'react';
import logo from "../assets/logo.png";

// Square Component with animated hover & active effects
function Square({ value, onSquareClick, isWinning }) {
  return (
    <div
      onClick={onSquareClick}
      className={`square flex justify-center items-center cursor-pointer select-none 
                  w-24 h-24 md:w-28 md:h-28 text-5xl font-extrabold rounded-lg 
                  shadow-lg transition-all duration-300 transform 
                  ${isWinning ? 'bg-gradient-to-r from-green-400 to-green-600 text-white scale-110 animate-pulse' 
                              : 'bg-white hover:scale-105 hover:shadow-2xl hover:bg-yellow-100'}`}
    >
      {value}
    </div>
  );
}

// Board Component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  const isDraw = !winner && squares.every(s => s !== null);

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Match Draw"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status text-center text-2xl md:text-3xl font-bold mb-6 p-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md">
        {status}
      </div>
      <div className="board grid grid-cols-3 gap-4">
        {squares.map((square, idx) => (
          <Square
            key={idx}
            value={square}
            onSquareClick={() => handleClick(idx)}
            isWinning={winningSquares.includes(idx)}
          />
        ))}
      </div>
    </>
  );
}

// Game Component
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const { winner } = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(s => s !== null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-10 p-8 bg-gradient-to-b from-yellow-50 to-yellow-200">
      {/* Header */}
      <div className="flex items-center gap-4 font-extrabold text-5xl md:text-6xl tracking-widest text-purple-700">
        <img src={logo} alt="Logo" className="h-12 md:h-16 animate-bounce" />
        Tic Tac Toe
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-6xl">
        {/* Board */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-fadeIn">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <button
            onClick={handleReset}
            className="mt-8 px-6 py-3 text-xl font-bold rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transform hover:scale-105 transition"
          >
            Reset Game
          </button>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 p-6 bg-white rounded-3xl shadow-2xl">
          {!winner && !isDraw && (
            <>
              <div className="text-2xl font-bold text-center mb-4 uppercase border-b-2 pb-2">
                Move History
              </div>
              <ol className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {history.map((squares, move) => {
                  const desc = move === 0 ? 'Game Start' : `Move #${move}`;
                  return (
                    <li key={move}>
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 transition"
                        onClick={() => jumpTo(move)}
                      >
                        {desc}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {(winner || isDraw) && (
            <div className="text-4xl font-extrabold text-center p-8 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg animate-bounce">
              {winner ? `🎉 ${winner} Wins! 🎉` : '🤝 Match Draw! 🤝'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Winner Calculation
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a,b,c] };
    }
  }
  return { winner: null, winningSquares: [] };
}
