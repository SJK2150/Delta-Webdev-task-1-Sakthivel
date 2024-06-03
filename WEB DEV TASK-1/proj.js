// JavaScript code for the game logic


const BOARD_SIZE = 8;
let currentPlayer = 1;
let player1Time = 300; 
let player2Time = 300;
let timer;
let selectedPiece = null;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const player1name = urlParams.get('player1');
const player2name = urlParams.get('player2');


console.log(`Player 1 (Red): ${player1name}`);
console.log(`Player 2 (Blue): ${player2name}`);
document.getElementById("red").textContent = `PLAYER RED -(${player1name})`
document.getElementById("blue").textContent = `PLAYER BLUE -(${player2name})`

const PIECESR = {
    TITAN: 'Titan',
    TANK: 'Tank',
    RICOCHETS: 'Ricochets',
    SEMI_RICOCHETS: 'Semi Ricochets',
    CANNON: 'Cannon'
};
const PIECESB = {
    TITAN: 'Titan',
    TANK: 'Tank',
    RICOCHETS: 'Ricochets',
    SEMI_RICOCHETS: 'Semi Ricochets',
    CANNON: 'Cannon'
};

function addIconToCellBlue(cell, pieceType) {
    const iconB = document.createElement('div');
    iconB.className = 'iconB';
    iconB.setAttribute('draggable',true)
    iconB.style.backgroundImage = `url(${getIconUrl(pieceType)})`;
    cell.appendChild(iconB);
}
function addIconToCellRed(cell, pieceType) {
    const iconR = document.createElement('div');
    iconR.className = 'iconR';
    iconR.setAttribute('draggable',true)
    iconR.style.backgroundImage = `url(${getIconUrl(pieceType)})`;
    cell.appendChild(iconR);
}
function getIconUrl(pieceType) {
    switch (pieceType) {
        case PIECESR.TITAN:
            return 'titan.png'; 
        case PIECESR.TANK:
            return 'tank.png'; 
        case PIECESR.CANNON:
            return 'canon.png'; 
        case PIECESR.RICOCHETS:
            return 'line.png';
        case PIECESR.SEMI_RICOCHETS:
            return 'right-angle.png'
        case PIECESB.TITAN:
            return 'titan.png'; 
        case PIECESB.TANK:
            return 'tank.png'; 
        case PIECESB.CANNON:
            return 'canon.png'; 
        case PIECESB.RICOCHETS:
            return 'line.png';
        case PIECESB.SEMI_RICOCHETS:
            return 'right-angle.png'
        default:
            return '';
    }
}


function initializeBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
           
            cell.className = 'cell';
            cell.id = `cell-${i}-${j}`;
            
            cell.onclick = () => cellClicked(i, j);
            
           
            if (i == 1 && j === 2) {
                addIconToCellRed(cell, PIECESR.TITAN);
            }
            if(i==0 && j==3){
                addIconToCellRed(cell,PIECESR.TANK)
            }
            if(i==0 && j==4){
                addIconToCellRed(cell,PIECESR.CANNON)
            }
            if(i==0 && j==5){
                addIconToCellRed(cell,PIECESR.RICOCHETS)
            }
            if(i==0 && j==6){
                addIconToCellRed(cell,PIECESR.SEMI_RICOCHETS)
            }
            if (i == 7 && j === 2) {
                addIconToCellBlue(cell, PIECESB.TITAN);
            }
            if(i==7 && j==3){
                addIconToCellBlue(cell,PIECESB.TANK)
            }
            if(i==7 && j==4){
                addIconToCellBlue(cell,PIECESB.CANNON)
            }
            if(i==7 && j==5){
                addIconToCellBlue(cell,PIECESB.RICOCHETS)
            }
            if(i==7 && j==6){
                addIconToCellBlue(cell,PIECESB.SEMI_RICOCHETS)
            }


            
            board.appendChild(cell);
        }
    }
}
function startGame() {
    initializeBoard();
    const allIcons = document.querySelectorAll('.iconR, .iconB');
    allIcons.forEach(icon => {
        icon.addEventListener('dragstart', dragStart);
        icon.addEventListener('dragover', dragOver);
        icon.addEventListener('drop', dragDrop);
    });
    startTimer();
}

function dragStart(e) {
    startPositionId = e.target.closest('.cell').id;
    draggedElement = e.target;
    e.dataTransfer.setData('text/plain', ''); // Set data to enable dragging
    e.dataTransfer.setDragImage(draggedElement, 0, 0);
}



function dragOver(e) {
    e.preventDefault();
    
    const draggedCell = e.target.closest('.cell');
    const draggedRowIndex = parseInt(draggedCell.id.split('-')[1]);
    const draggedColIndex = parseInt(draggedCell.id.split('-')[2]);
    const targetRowIndex = parseInt(e.target.parentElement.id.split('-')[1]);
    const targetColIndex = parseInt(e.target.parentElement.id.split('-')[2]);

    // Calculate the row and column differences
    const rowDiff = targetRowIndex - draggedRowIndex;
    const colDiff = targetColIndex - draggedColIndex;

    // Check if the cursor is pointing to an adjacent cell
    if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
        // Allow the element to be dropped on the target cell
        e.target.classList.add('highlight');
    } else {
        // Prevent dropping if the cursor is not pointing to an adjacent cell
        e.target.classList.remove('highlight');
    }
}

function dragDrop(e) {
    e.stopPropagation();

    const draggedElement = document.querySelector('.dragging');
    const targetCell = e.target.closest('.cell');
    
    // Check if the target cell is highlighted (i.e., adjacent)
    if (targetCell.classList.contains('highlight')) {
        targetCell.appendChild(draggedElement);
    }
    
    // Remove the highlight class after dropping
    targetCell.classList.remove('highlight');
}










function startTimer() {
    timer = setInterval(() => {
        if (currentPlayer === 1) {
            player1Time--;
            
            if (player1Time <= 0) {
                endGame(2);
            }
        } else {
            player2Time--;
        
            if (player2Time <= 0) {
                endGame(1);
            }
            
        }
    }, 1000); 
}


function pauseGame() {
    clearInterval(timer);
}


function resumeGame() {
    startTimer();
}


function resetGame() {
    clearInterval(timer);
    player1Time = 300; 
    player2Time = 300;
    currentPlayer = 1;
    initializeBoard(); 
}


function endGame(winner) {
    clearInterval(timer);
    alert(`Player ${winner} wins!`);
}

// Function to handle cell click
function cellClicked(row, col) {
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    const piece = getPieceType(row, col);

    // If a piece is selected, try to move or shoot
    if (selectedPiece) {
        const [selectedRow, selectedCol] = selectedPiece;
        const selectedPieceType = getPieceType(selectedRow, selectedCol);

        // Move the piece
        if (piece === null) {
            movePiece(selectedRow, selectedCol, row, col);
        }
        // Shoot the bullet
        else if (selectedPieceType === (PIECESR.CANNON || PIECESB.CANNON) && piece === (PIECESR.RICOCHETS || PIECESB.RICOCHETS)) {
            shootBullet(row, col);
        }
        // Deselect the piece if clicked again
        if (selectedPiece[0] === row && selectedPiece[1] === col) {
            selectedPiece = null;
            cell.style.backgroundColor = '';
        }
    }
    // Select the piece if clicked
    else if (piece !== null && currentPlayer === 1) {
        selectedPiece = [row, col];
        cell.style.backgroundColor = 'yellow';
    }
}

// Function to move the piece
function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromCell = document.getElementById(`cell-${fromRow}-${fromCol}`);
    const toCell = document.getElementById(`cell-${toRow}-${toCol}`);

    // Check if the move is valid
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        // Move the piece to the new position
        toCell.innerHTML = fromCell.innerHTML;
        fromCell.innerHTML = '';
        // Deselect the piece
        selectedPiece = null;
        fromCell.style.backgroundColor = '';
        // Switch player after move
        switchPlayer();
    } else {
        alert("Invalid move!");
    }
}

// Function to shoot the bullet
function shootBullet(row, col) {
    // Check if the bullet path is clear
    if (isBulletPathClear(row, col)) {
        


        // Implement bullet movement logic here
        // For example, change the background color of the cell to indicate the bullet path
        // After shooting, switch player
        switchPlayer();
    } else {
        alert("Bullet path is blocked!");
    }
}

// Function to check if a move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
        return false;
    }

    // Get the type of piece at the source position
    const pieceType = getPieceType(fromRow, fromCol);
    
    if (pieceType === null || pieceType.player !== currentPlayer) {
        return false;
    }

    // Check if the destination cell is occupied by the player's own piece
    const destinationPieceType = getPieceType(toRow, toCol);
    if (destinationPieceType !== null && destinationPieceType.player === currentPlayer) {
        return false;
    }

    // Implement rules for valid moves based on the piece type
    switch (pieceType) {
        case PIECES.TITAN:
            // Example: Titans can move one square in any direction
            const rowDiff = Math.abs(toRow - fromRow);
            const colDiff = Math.abs(toCol - fromCol);
            return (rowDiff <= 1 && colDiff <= 1);
        case PIECES.TANK:
            // Example: Tanks can move one square in any direction or rotate
            return (Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1);
        
        default:
            
            return false;
    }

    
}

// Function to check if the bullet path is clear
function isBulletPathClear(row, col) {

  
    return true; // Placeholder, replace with actual logic
}

// Function to get the type of piece at a given position
function getPieceType(row, col) {
    
    const board = [
        [null, null, PIECESR.TITAN, PIECESR.TANK, PIECESR.CANNON, PIECESR.RICOCHETS, PIECESR.SEMI_RICOCHETS, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, PIECESB.TITAN, PIECESB.TANK, PIECESB.CANNON, PIECESB.RICOCHETS, PIECESB.SEMI_RICOCHETS, null] 
    ];
    // Return the piece type at the specified position
    return board[row][col]; // Placeholder, replace with actual logic
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}
