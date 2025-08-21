import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Minimalistic, responsive Tic Tac Toe game.
 * - 2-player local gameplay
 * - Centered board with controls below
 * - Reset game
 * - Winner highlight
 * - Light theme with provided palette
 */

// Helpers
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine winner and winning line from a 9-length board state. */
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// Square Component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

// Board Component
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => {
    const isWinning = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinning}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" role="row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <div role="gridcell" key={idx}>
                {renderSquare(idx)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main App component hosting the game state and controls. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && squares.every((s) => s !== null);

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'Draw';
    return `Next: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  // Center document theme to light as requested
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const handleSquareClick = (i) => {
    if (squares[i] || winner) return; // ignore filled or finished
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset the game to initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title" aria-label="Tic Tac Toe">
          Tic Tac Toe
        </h1>
      </header>

      <main className="app-main">
        <section className="game-card" aria-label="Game Area">
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={line}
          />

          <div className="controls">
            <div
              className={`status ${winner ? 'status-win' : isDraw ? 'status-draw' : ''}`}
              role="status"
              aria-live="polite"
            >
              {status}
            </div>

            <div className="buttons">
              <button className="btn primary" onClick={resetGame}>
                Reset Game
              </button>
            </div>

            <div className="legend">
              <span className="badge x">X</span>
              <span>vs</span>
              <span className="badge o">O</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <small>Built with React</small>
      </footer>
    </div>
  );
}

export default App;
