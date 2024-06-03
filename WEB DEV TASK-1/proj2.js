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
    if (pieceType === PIECESB.CANNON || pieceType === PIECESB.CANNON) {
        iconB.id = "cannon";
    }
    if (pieceType === PIECESB.TANK || pieceType === PIECESB.TANK) {
        iconB.id = "tank";
    }
    if (pieceType === PIECESB.SEMI_RICOCHETS || pieceType === PIECESB.SEMI_RICOCHETS) {
        iconB.id = "semi";
    }
    if (pieceType === PIECESB.TITAN || pieceType === PIECESB.TITAN) {
        iconB.id = "titan";
    }
    if (pieceType === PIECESB.RICOCHETS || pieceType === PIECESB.RICOCHETS) {
        iconB.id = "rico";
    }
    cell.appendChild(iconB);
}

function addIconToCellRed(cell, pieceType) {
    const iconR = document.createElement('div');
    iconR.className = 'iconR';
    iconR.setAttribute('draggable', true);
    if (pieceType === PIECESB.CANNON || pieceType === PIECESB.CANNON) {
        iconR.id = "cannon";
    }
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
            return 'right-angle.png';
        case PIECESB.TITAN:
            return 'titan.png';
        case PIECESB.TANK:
            return 'tank.png';
        case PIECESB.CANNON:
            return 'canon.png';
        case PIECESB.RICOCHETS:
            return 'line.png';
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
        shootBullet(rowIndex, colIndex, color, currentPlayer);
    });
}




function shootBullet(rowIndex, colIndex, color) {
    let targetRow, targetCol;
    
    
   
    

    if (color === 'red') {
        targetRow = rowIndex + 1; // Shoots upward for red cannons
        targetCol = colIndex;
    } else {
        targetRow = rowIndex - 1; // Shoots downward for blue cannons
        targetCol = colIndex;
    }

   

  

    
    while (isValidCell(targetRow, targetCol)) {
        const targetCellId = `cell-${targetRow}-${targetCol}`;
        const targetCell = document.getElementById(targetCellId);

       
        if (targetCell.childElementCount > 0) {
            if (targetCell === document.getElementById('rico').parentElement) {
                changedirection();
                break;
            } else {
                break;
            }
        }

        // Create a bullet element and append it to the target cell
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.classList.add(color === 'red' ? 'bullet-red' : 'bullet-blue');
        targetCell.appendChild(bullet);

        // Remove the bullet from the previous cell if it exists
        const previousCellId = `cell-${rowIndex}-${colIndex}`;
        const previousCell = document.getElementById(previousCellId);
        const previousBullet = previousCell.querySelector('.bullet');
        if (previousBullet) {
            previousBullet.remove();
        }

        // Calculate the position of the next cell
        if (color === 'red') {
            targetRow++;
        } else {
            targetRow--;
        }
    }


    thing = document.getElementById(`cell-${targetRow}-${targetCol}`);

    if (thing && (thing.querySelector('.iconR#titan') || thing.querySelector('.iconB#titan'))) {
        endGame(currentPlayer);
    }
    
    
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

function startGame() {
    initializeBoard();
    shootCannonBullets(currentPlayer);
    createRotateButton();
    changedirection();
   
    const allIcons = document.querySelectorAll('.iconR, .iconB');
    allIcons.forEach(icon => {
        icon.addEventListener('dragstart', dragStart);
    });
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', dragDrop);
    });
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
    }
    targetCell.classList.remove('highlight');
}

function endGame(winner) {
    clearInterval(timer);
    alert(`Player ${winner} wins!`);
}




function createRotateButton() {
    
    if (!document.getElementById('rotateButton')) {
        
        console.log("nigga")
        const rotateButton = document.createElement('button');
        rotateButton.id = 'rotateButton';
        rotateButton.textContent = 'Rotate';

        // Add event listener to the "Rotate" button
        rotateButton.addEventListener('click', rotateRicochet);

        // Append the "Rotate" button to the container of the board
        const bottomBar = document.querySelector('.bottom-bar');
        bottomBar.appendChild(rotateButton);
    }
}

// Function to rotate the ricochet icon
function rotateRicochet() {
    const ricochetIcon = document.getElementById('rico');
    if (ricochetIcon) {
        let currentRotation = parseInt(ricochetIcon.style.transform.replace('rotate(', '').replace('deg)', '') || '0');
        currentRotation += 90;
        ricochetIcon.style.transform = `rotate(${currentRotation}deg)`;
    }
}
let count=0;
let turns;
function changedirection(){

    document.getElementById('rotateButton').addEventListener('click',()=>{
        
        count++
        
        turns=count%4
        console.log(turns)
        if (count % 2 === 0) {
            targetRow = rowIndex; 
            targetCol = BOARD_SIZE - 1 - colIndex; 
        } else {
            targetRow = BOARD_SIZE - 1 - rowIndex; 
            targetCol = colIndex; 
        }
    });

}

