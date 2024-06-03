const BOARD_SIZE = 8;
let startPositionId;
let draggedElement;

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
    iconB.setAttribute('draggable', true);
    iconB.style.backgroundImage = `url(${getIconUrl(pieceType)})`;
    iconB.id = getPieceId(pieceType);
    cell.appendChild(iconB);
}

function addIconToCellRed(cell, pieceType) {
    const iconR = document.createElement('div');
    iconR.className = 'iconR';
    iconR.setAttribute('draggable', true);
  
    iconR.id = getPieceId(pieceType);
    cell.appendChild(iconR);
}

function getPieceId(pieceType) {
    switch (pieceType) {
        case PIECESB.CANNON:
            return 'cannon';
        case PIECESB.TANK:
            return 'tank';
        case PIECESB.SEMI_RICOCHETS:
            return 'semi';
        case PIECESB.TITAN:
            return 'titan';
        case PIECESB.RICOCHETS:
            return 'rico';
        default:
            return '';
    }
}

function getIconUrl(pieceType) {
    switch (pieceType) {
        case PIECESR.TITAN:
        case PIECESB.TITAN:
            return 'titan.png';
        case PIECESR.TANK:
        case PIECESB.TANK:
            return 'tank.png';
        case PIECESR.CANNON:
        case PIECESB.CANNON:
            return 'canon.png';
        case PIECESR.RICOCHETS:
        case PIECESB.RICOCHETS:
            return 'line.png';
        case PIECESR.SEMI_RICOCHETS:
        case PIECESB.SEMI_RICOCHETS:
            return 'right-angle.png';
        default:
            return '';
    }
}

function Rand(m, n) {
    m = Math.ceil(m);
    n = Math.floor(n);
    return Math.floor(Math.random() * (n - m + 1)) + m;
}

const m = Rand(0, 7);
const n = Rand(0, 7);


function shootCannonBullets(currentPlayer) {
    const cannonIcons = document.querySelectorAll(currentPlayer === 1 ? '.iconR#cannon' : '.iconB#cannon');

    cannonIcons.forEach(icon => {
        const cell = icon.parentElement;
        const rowIndex = parseInt(cell.id.split('-')[1]);
        const colIndex = parseInt(cell.id.split('-')[2]);
        const color = icon.classList.contains('iconR') ? 'red' : 'blue';
        shootBullet(rowIndex, colIndex, color);
    });
}

function shootBullet(rowIndex, colIndex, color) {
    let targetRow, targetCol;

    if (color === 'red') {
        targetRow = rowIndex + 1; // Shoots downward for red cannons
        targetCol = colIndex;
    } else {
        targetRow = rowIndex - 1; // Shoots upward for blue cannons
        targetCol = colIndex;
    }

    const interval = setInterval(() => {
        if (!isValidCell(targetRow, targetCol)) {
            clearInterval(interval);
            return;
        }

        const targetCellId = `cell-${targetRow}-${targetCol}`;
        const targetCell = document.getElementById(targetCellId);

        // Remove bullet from the previous cell
        const previousCellId = `cell-${rowIndex}-${colIndex}`;
        const previousCell = document.getElementById(previousCellId);
        const previousBullet = previousCell.querySelector('.bullet');
        if (previousBullet) {
            previousBullet.remove();
        }

        // Create and add the bullet to the target cell
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.classList.add(color === 'red' ? 'bullet-red' : 'bullet-blue');
        targetCell.appendChild(bullet);

        // Check if the cell contains any piece that should stop the bullet
        if (targetCell.childElementCount > 1) {
            clearInterval(interval);
            if (targetCell.querySelector('#rico')) {
                changedirection();
            }

            // Check if the cell contains a Titan and change its class
            const titan = targetCell.querySelector('.iconR#titan, .iconB#titan');
            const canon = targetCell.querySelector('.iconR#cannon, .iconB#tcannon');
            const rico = targetCell.querySelector('.iconR#rico, .iconB#rico');
            const semir = targetCell.querySelector('.iconR#semi, .iconB#semi');
            const tank = targetCell.querySelector('.iconR#tank, .iconB#tank');
           
            if (titan) {
                changeTitanId(titan);
                endGame(currentPlayer);
                
            }
            if (canon) {
                changeTitanId(titan);
                endGame(currentPlayer);
                
            }
            if (rico) {
                changeTitanId(titan);
                endGame(currentPlayer);
                
            }
            if (semir) {
                changeTitanId(titan);
                
                
            }
            if (tank) {
                changeTitanId(titan);
                endGame(currentPlayer);
                
            }
            return;
        }

        // Move to the next cell
        rowIndex = targetRow;
        colIndex = targetCol;

        if (color === 'red') {
            targetRow++;
        } else {
            targetRow--;
        }

    }, 200);
}

function changeTitanId(titan) {
    if (titan) {
        // Change the id to 'titan-hit'
        titan.id = 'titan-hit';
        console.log('Titan id changed to:', titan.id);

        // Optionally, change the id back to 'titan' after a short interval
        setTimeout(() => {
            titan.id = 'titan';
        }, 500); // Adjust the time as needed
    }
}

const style = document.createElement('style');
style.innerHTML = `
#titan-hit {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('destroyed.jpg'); /* Ensure the correct path */
    background-color: black;
    position: relative;
    z-index: 10;
    cursor: move;
}
`;
document.head.appendChild(style);

function isValidCell(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}



function isValidCell(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
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

            board.appendChild(cell);
        }
    }
    addIconToCellRed(document.getElementById('cell-1-2'), PIECESR.CANNON);
    addIconToCellRed(document.getElementById('cell-0-3'), PIECESR.TANK);
    addIconToCellRed(document.getElementById('cell-0-4'), PIECESR.TITAN);
    addIconToCellRed(document.getElementById('cell-0-5'), PIECESR.RICOCHETS);
    addIconToCellRed(document.getElementById('cell-0-6'), PIECESR.SEMI_RICOCHETS);
    addIconToCellBlue(document.getElementById('cell-5-2'), PIECESB.RICOCHETS);
    addIconToCellBlue(document.getElementById('cell-7-3'), PIECESB.TANK);
    addIconToCellBlue(document.getElementById('cell-7-4'), PIECESB.CANNON);
    addIconToCellBlue(document.getElementById('cell-7-5'), PIECESB.TITAN);
    addIconToCellBlue(document.getElementById('cell-7-6'), PIECESB.SEMI_RICOCHETS);
}

let currentPlayer = 1;
let timer;
let turnDuration = 30; // 30 seconds for each turn

function startGame() {
    initializeBoard();
    
    createRotateButton();

    const allIcons = document.querySelectorAll('.iconR, .iconB');
    allIcons.forEach(icon => {
        icon.addEventListener('dragstart', dragStart);
    });
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', dragDrop);
    });

    startTurn();
}

function startTurn() {
    clearInterval(timer);
    const turnDisplay = document.getElementById('turn-display');
    turnDisplay.textContent = `Player ${currentPlayer}'s turn`;

    let timeRemaining = turnDuration;
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = `Time remaining: ${timeRemaining}s`;

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Time remaining: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            switchTurn();
        }
    }, 1000);
}

function switchTurn() {
    clearInterval(timer);
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    shootCannonBullets(currentPlayer);
    
    startTurn();
}

function dragStart(e) {
    startPositionId = e.target.closest('.cell').id;
    draggedElement = e.target;
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.setDragImage(draggedElement, 0, 0);
}

function dragOver(e) {
    e.preventDefault();

    const draggedCell = draggedElement.closest('.cell');
    const draggedRowIndex = parseInt(draggedCell.id.split('-')[1]);
    const draggedColIndex = parseInt(draggedCell.id.split('-')[2]);
    const targetCell = e.target.closest('.cell');
    const targetRowIndex = parseInt(targetCell.id.split('-')[1]);
    const targetColIndex = parseInt(targetCell.id.split('-')[2]);

    const rowDiff = Math.abs(targetRowIndex - draggedRowIndex);
    const colDiff = Math.abs(targetColIndex - draggedColIndex);
    const draggedCellChildren = draggedCell.children;

    if (draggedCellChildren[0].id === "cannon") {
        if (rowDiff === 0 && colDiff === 1) {
            targetCell.classList.add('highlight');
        } else {
            targetCell.classList.remove('highlight');
        }
    } else {
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1)) {
            targetCell.classList.add('highlight');
        } else {
            targetCell.classList.remove('highlight');
        }
    }
}

function dragDrop(e) {
    e.stopPropagation();
    const targetCell = e.target.closest('.cell');
    const draggedCell = draggedElement.closest('.cell');
    if (targetCell.classList.contains('highlight')) {
        targetCell.appendChild(draggedElement);
        draggedCell.innerHTML = '';
        switchTurn();
    }
    targetCell.classList.remove('highlight');
}

function endGame(winner) {
    clearInterval(timer);
    
}

function createRotateButton() {
    if (!document.getElementById('rotateButton')) {
        const rotateButton = document.createElement('button');
        rotateButton.id = 'rotateButton';
        rotateButton.textContent = 'Rotate';

        rotateButton.addEventListener('click', rotateRicochet);
        const bottomBar = document.querySelector('.bottom-bar');
        bottomBar.appendChild(rotateButton);
    }
}

function rotateRicochet() {
    const ricochetIcon = document.getElementById('rico');
    if (ricochetIcon) {
        let currentRotation = parseInt(ricochetIcon.style.transform.replace('rotate(', '').replace('deg)', '') || '0');
        currentRotation += 90;
        ricochetIcon.style.transform = `rotate(${currentRotation}deg)`;
    }
}

let count = 0;
let turns;

function changedirection() {
    const rotateButton = document.getElementById('rotateButton');
    if (rotateButton) {
        rotateButton.addEventListener('click', () => {
            count++;
            turns = count % 4;
            console.log(turns);
        });
    }
}

// Call startGame to initialize everything
startGame();

