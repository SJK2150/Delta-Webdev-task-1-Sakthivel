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
    iconB.dataset.rotation = 0; 
    iconB.addEventListener('click', rotateIcon);
    cell.appendChild(iconB);
}

function addIconToCellRed(cell, pieceType) {
    const iconR = document.createElement('div');
    iconR.className = 'iconR';
    iconR.setAttribute('draggable', true);
    iconR.style.backgroundImage = `url(${getIconUrl(pieceType)})`; 
    iconR.id = getPieceId(pieceType);
    iconR.dataset.rotation = 0;
    iconR.addEventListener('click', rotateIcon);
    cell.appendChild(iconR);
}

function rotateIcon(event) {
    const icon = event.target;
    const currentRotation = parseInt(icon.dataset.rotation) || 0;
    const newRotation = (currentRotation + 90) % 360;
    icon.style.transform = `rotate(${newRotation}deg)`;
    icon.dataset.rotation = newRotation;
}

function cellClicked(rowIndex, colIndex) {
    console.log(`Cell clicked: ${rowIndex}-${colIndex}`);
    
    // Remove highlight from all cells
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    // Add highlight to adjacent cells
    const adjacentCellIndices = [
        [rowIndex - 1, colIndex],   // Top
        [rowIndex + 1, colIndex],   // Bottom
        [rowIndex, colIndex - 1],   // Left
        [rowIndex, colIndex + 1],
        [rowIndex - 1, colIndex-1],   // Top-left
        [rowIndex + 1, colIndex-1],   // Bottom-left
        [rowIndex-1, colIndex +1],   // Top-right
        [rowIndex+1, colIndex + 1],   // Bottom-right
    ];

    adjacentCellIndices.forEach(indices => {
        const [adjRow, adjCol] = indices;
        if (isValidCell(adjRow, adjCol)) {
            const adjacentCell = document.getElementById(`cell-${adjRow}-${adjCol}`);
            adjacentCell.classList.add('highlight');
        }
    });
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

function changeElementId(element, newId, originalId) {
    if (element) {
        // Change the id to the new id
        element.id = newId;
        console.log(`Element id changed to: ${element.id}`);

        // Optionally, change the id back to the original id after a short interval
        setTimeout(() => {
            element.id = originalId;
            console.log(`Element id reverted to: ${element.id}`);
        }, 500); // Adjust the time as needed
    }
}

function shootCannonBullets(currentPlayer) {
    const cannonIcons = document.querySelectorAll(currentPlayer === 1 ? '.iconR#cannon' : '.iconB#cannon');

    cannonIcons.forEach(icon => {
        const cell = icon.parentElement;
        const rowIndex = parseInt(cell.id.split('-')[1]);
        const colIndex = parseInt(cell.id.split('-')[2]);
        const color = icon.classList.contains('iconR') ? 'red' : 'blue';
        const cannonRotation = parseInt(icon.dataset.rotation) || 0;
        shootBullet(rowIndex, colIndex, color, cannonRotation);
    });
}

function shootBullet(rowIndex, colIndex, color, rotation) {
    let deltaRow = 0;
    let deltaCol = 0;

    switch (rotation) {
        case 0: // Up
            deltaRow = -1;
            deltaCol = 0;
            break;
        case 90: // Right
            deltaRow = 0;
            deltaCol = 1;
            break;
        case 180: // Down
            deltaRow = 1;
            deltaCol = 0;
            break;
        case 270: // Left
            deltaRow = 0;
            deltaCol = -1;
            break;
        default:
            break;
    }

    let deflected = false;

    const interval = setInterval(() => {
        const targetRow = rowIndex + deltaRow;
        const targetCol = colIndex + deltaCol;

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

        if (targetRow === 0 || targetRow === BOARD_SIZE - 1 || targetCol === 0 || targetCol === BOARD_SIZE - 1) {
            clearInterval(interval);
            targetCell.removeChild(bullet);
            return;
        }

        if (targetCell.childElementCount > 1) {
            const titan = targetCell.querySelector('.iconR#titan, .iconB#titan');
            const cannon = targetCell.querySelector('.iconR#cannon, .iconB#cannon');
            const rico = targetCell.querySelector('.iconR#rico, .iconB#rico');
            const semi = targetCell.querySelector('.iconR#semi, .iconB#semi');
            const tank = targetCell.querySelector('.iconR#tank, .iconB#tank');

            if (titan) {
                changeElementId(titan, 'titan-hit', 'titan');
                endGame(currentPlayer);
                clearInterval(interval);
                return;
            }

            if (cannon) changeElementId(cannon, 'cannon-hit', 'cannon');
            if (rico && !deflected) {
                const ricoRotation = parseInt(rico.dataset.rotation) || 0;
                const deflection = deflectBullet('rico', ricoRotation, color, targetRow, targetCol);
                if (deflection) {
                    // Adjust direction based on deflection
                    deltaRow = deflection.newDeltaRow;
                    deltaCol = deflection.newDeltaCol;
                    deflected = true; // Ensure the bullet only deflects once
                    return; // Continue with the new direction
                }
            }
            if (semi && !deflected) {
                const semiRotation = parseInt(semi.dataset.rotation) || 0;
                const deflection = deflectBullet('semi', semiRotation, color, targetRow, targetCol);
                if (deflection) {
                    // Adjust direction based on deflection
                    deltaRow = deflection.newDeltaRow;
                    deltaCol = deflection.newDeltaCol;
                    deflected = true; // Ensure the bullet only deflects once
                    return; // Continue with the new direction
                }
            }
            if (tank) changeElementId(tank, 'tank-hit', 'tank');
        }

        rowIndex = targetRow;
        colIndex = targetCol;
    }, 200);
}

function deflectBullet(pieceType, rotation, color, rowIndex, colIndex) {
    if (pieceType === 'rico') {
        if (rotation === 0 || rotation === 180) {
            return {
                newDeltaRow: 0,
                newDeltaCol: (rotation === 0) ? -1 : 1
            };
        } else if (rotation === 90 || rotation === 270) {
            return {
                newDeltaCol: (rotation === 90) ? -1 : 1,
                newDeltaRow: 0
            };
        }
    } else if (pieceType === 'semi') {
        if (rotation === 0) {
            return {
                newDeltaRow: 0,
                newDeltaCol: -1
            };
        } else if (rotation === 90) {
            return {
                newDeltaRow: 0,
                newDeltaCol: 1
            };
        } else if (rotation === 180) {
            return {
                newDeltaRow: 0,
                newDeltaCol: 1
            };
        } else if (rotation === 270) {
            return {
                newDeltaRow: 0,
                newDeltaCol: -1
            };
        }
    }
    return null; // No deflection
}

function isValidCell(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function endGame(winningPlayer) {
    alert(`Player ${winningPlayer} wins!`);
    location.reload();
}

function dragstartHandler(event) {
    startPositionId = event.target.parentElement.id;
    draggedElement = event.target;
    event.dataTransfer.setData("text", event.target.id);
    console.log(`Drag started from: ${startPositionId}`);
}

function dragoverHandler(event) {
    event.preventDefault();
}

function dropHandler(event) {
    event.preventDefault();
    const targetCell = event.target.closest('.cell');

    if (!targetCell || targetCell === draggedElement.parentElement) return;

    if (targetCell.classList.contains('highlight')) {
        if (targetCell.classList.contains('iconR') || targetCell.classList.contains('iconB')) {
            alert('Invalid move: Target cell is already occupied.');
            return;
        }
        targetCell.appendChild(draggedElement);
    }
}

function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
        for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${rowIndex}-${colIndex}`;
            cell.addEventListener('click', () => cellClicked(rowIndex, colIndex));
            cell.addEventListener('dragover', dragoverHandler);
            cell.addEventListener('drop', dropHandler);
            gameBoard.appendChild(cell);
        }
    }
    addInitialPieces();
}

function addInitialPieces() {
    const playerR = [
        PIECESR.TITAN,
        PIECESR.TANK,
        PIECESR.RICOCHETS,
        PIECESR.SEMI_RICOCHETS,
        PIECESR.CANNON,
        PIECESR.TANK,
        PIECESR.SEMI_RICOCHETS,
        PIECESR.RICOCHETS
    ];

    const playerB = [
        PIECESB.TITAN,
        PIECESB.TANK,
        PIECESB.RICOCHETS,
        PIECESB.SEMI_RICOCHETS,
        PIECESB.CANNON,
        PIECESB.TANK,
        PIECESB.SEMI_RICOCHETS,
        PIECESB.RICOCHETS
    ];

    for (let i = 0; i < BOARD_SIZE; i++) {
        const cellR = document.getElementById(`cell-0-${i}`);
        addIconToCellRed(cellR, playerR[i]);

        const cellB = document.getElementById(`cell-${BOARD_SIZE - 1}-${i}`);
        addIconToCellBlue(cellB, playerB[i]);
    }
}

document.addEventListener('DOMContentLoaded', createGameBoard);
