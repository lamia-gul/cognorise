const boardElement = document.querySelector('.board');
const statusElement = document.querySelector('.status');
const resetButton = document.querySelector('.reset');

let board = Array(9).fill('');
const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';
let gameOver = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Create the game board
function createBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        cellElement.addEventListener('click', handleMove);
        boardElement.appendChild(cellElement);
    });
}

// Handle player's move
function handleMove(event) {
    if (gameOver) return; // Stop if the game is already over

    const index = event.target.dataset.index;

    if (board[index] === '') {
        board[index] = HUMAN_PLAYER;
        updateBoard();

        if (checkWin(HUMAN_PLAYER)) {
            statusElement.textContent = 'You Win!';
            gameOver = true;
            return;
        }

        if (checkTie()) {
            statusElement.textContent = 'It\'s a Tie!';
            gameOver = true;
            return;
        }

        setTimeout(() => {
            aiMove();
        }, 500);
    }
}

// AI's move
function aiMove() {
    if (gameOver) return; // Stop if the game is already over

    const bestMove = getBestMove();
    board[bestMove] = AI_PLAYER;
    updateBoard();

    if (checkWin(AI_PLAYER)) {
        statusElement.textContent = 'AI Wins!';
        gameOver = true;
        return;
    }

    if (checkTie()) {
        statusElement.textContent = 'It\'s a Tie!';
        gameOver = true;
    }
}

// Check if a player has won
function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination =>
        combination.every(index => board[index] === player)
    );
}

// Check for a tie
function checkTie() {
    return board.every(cell => cell !== '') && !checkWin(HUMAN_PLAYER) && !checkWin(AI_PLAYER);
}

// Update the board UI
function updateBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = board[index];
        cell.classList.toggle('taken', board[index] !== '');
    });
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
    if (checkWin(AI_PLAYER)) return 10 - depth;
    if (checkWin(HUMAN_PLAYER)) return depth - 10;
    if (newBoard.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        newBoard.forEach((cell, index) => {
            if (cell === '') {
                newBoard[index] = AI_PLAYER;
                const score = minimax(newBoard, depth + 1, false);
                newBoard[index] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        newBoard.forEach((cell, index) => {
            if (cell === '') {
                newBoard[index] = HUMAN_PLAYER;
                const score = minimax(newBoard, depth + 1, true);
                newBoard[index] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

// Get the best move for the AI
function getBestMove() {
    let bestScore = -Infinity;
    let move = null;
    board.forEach((cell, index) => {
        if (cell === '') {
            board[index] = AI_PLAYER;
            const score = minimax(board, 0, false);
            board[index] = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    return move;
}

// Reset the game
resetButton.addEventListener('click', () => {
    board = Array(9).fill('');
    gameOver = false;
    statusElement.textContent = 'Your Turn';
    createBoard();
});

// Initialize the game
createBoard();
