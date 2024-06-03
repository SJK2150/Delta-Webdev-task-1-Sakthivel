const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const player1name = urlParams.get('player1') ?? 'Player 1';
const player2name = urlParams.get('player2') ?? 'Player 2';

const soundEffect = document.getElementById('sound-effect');
const soundEffect2 = document.getElementById('sound-effect2');
const soundEffect3 = document.getElementById('sound-effect3');
const soundEffect4=document.getElementById('sound-effect4')
const soundEffect5=document.getElementById('sound-effect5')

function playSoundEffect() {
   
    soundEffect.play();
}
function playSoundEffect2() {
   
    soundEffect2.play();
}
function playSoundEffect3(){
    soundEffect3.play();
}
function playSoundEffect4(){
    soundEffect4.play();
}
function playSoundEffect5(){
    soundEffect5.play();
}


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
    
    
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    
    const adjacentCellIndices = [
        [rowIndex - 1, colIndex],   
        [rowIndex + 1, colIndex],   
        [rowIndex, colIndex - 1],   
        [rowIndex, colIndex + 1],
        [rowIndex - 1, colIndex-1],   
        [rowIndex + 1, colIndex-1],  
        [rowIndex-1, colIndex +1],  
        [rowIndex+1, colIndex + 1],   
    ];

    adjacentCellIndices.forEach(indices => {
        const [adjRow, adjCol] = indices;
        if (isValidCell(adjRow, adjCol)) {
            const adjacentCell = document.getElementById(`cell-${adjRow}-${adjCol}`);
            
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
   
        element.id = newId;
        console.log(`Element id changed to: ${element.id}`);

        
        setTimeout(() => {
            element.id = originalId;
            console.log(`Element id reverted to: ${element.id}`);
        }, 500); 
    }
}

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
    let deltaRow = color === 'red' ? 1 : -1;
    let deltaCol = 0;
    let count = 0;

    const interval = setInterval(() => {
        let targetRow = rowIndex + deltaRow;
        let targetCol = colIndex + deltaCol;

        if (!isValidCell(targetRow, targetCol)) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        const targetCellId = `cell-${targetRow}-${targetCol}`;
        const targetCell = document.getElementById(targetCellId);

        const previousCellId = `cell-${rowIndex}-${colIndex}`;
        const previousCell = document.getElementById(previousCellId);
        const previousBullet = previousCell.querySelector('.bullet');
        if (previousBullet) {
            previousBullet.remove();
        }
        playSoundEffect()
        const bullet = document.createElement('div');
        bullet.className = 'bullet shoot';
        bullet.classList.add(color === 'red' ? 'bullet-red' : 'bullet-blue');
        targetCell.appendChild(bullet);

        if (targetCell.childElementCount === 0 && (targetRow === 0 || targetRow === BOARD_SIZE - 1 || targetCol === 0 || targetCol === BOARD_SIZE - 1)) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        if (targetCell.childElementCount > 1) {
            const titan = targetCell.querySelector('.iconR#titan, .iconB#titan');
            const cannon = targetCell.querySelector('.iconR#cannon, .iconB#cannon');
            const rico = targetCell.querySelector('.iconR#rico, .iconB#rico');
            const semi = targetCell.querySelector('.iconR#semi, .iconB#semi');
            const tank = targetCell.querySelector('.iconR#tank, .iconB#tank');

            if (titan && ((color === 'red' && titan.classList.contains('iconB')) || (color === 'blue' && titan.classList.contains('iconR')))) {
                playSoundEffect3();
                changeElementId(titan, 'titan-hit', 'titan');
                endGame(currentPlayer);
                clearInterval(interval);
                return;
            }

            if (cannon){
                changeElementId(cannon, 'cannon-hit', 'cannon')
                playSoundEffect3();} 
            if (rico) {
                count++;
                const ricoRotation = parseInt(rico.dataset.rotation) || 0;
                const deflection = deflectBullet('rico', ricoRotation, color, count, targetRow, targetCol, bullet, interval, deltaRow, deltaCol);
                deltaRow = deflection.newDeltaRow;
                deltaCol = deflection.newDeltaCol;
                rowIndex = targetRow;
                colIndex = targetCol;
                return;
            }
            if (semi) {
                count++;
                const semiRotation = parseInt(semi.dataset.rotation) || 0;
                const deflection = deflectBullet('semi', semiRotation, color, count, targetRow, targetCol, bullet, interval, deltaRow, deltaCol);
                deltaRow = deflection.newDeltaRow;
                deltaCol = deflection.newDeltaCol;
                rowIndex = targetRow;
                colIndex = targetCol;
                return;
            }

            if (tank) {
                changeElementId(tank, 'tank-hit', 'tank');
                playSoundEffect3();
            }
            bullet.remove();
            clearInterval(interval);
            return;
        }

        rowIndex = targetRow;
        colIndex = targetCol;

    }, 300);
}


function pop(arr) {
    if (arr.length === 0) {
        throw new Error("Array is empty");
    }
    
    const randomIndex = Math.floor(Math.random() * arr.length);
    
    return arr.splice(randomIndex, 1)[0];
}

l=[0,0,1,2,2,3,4,5,6,7]

    


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
    addIconToCellRed(document.getElementById(`cell-${Rand(0,1)}-${pop(l)}`), PIECESR.CANNON);
    addIconToCellRed(document.getElementById(`cell-${Rand(0,3)}-${pop(l)}`), PIECESR.TANK);
    addIconToCellRed(document.getElementById(`cell-0-${pop(l)}`), PIECESR.TITAN);
    addIconToCellRed(document.getElementById(`cell-${Rand(0,3)}-${pop(l)}`), PIECESR.RICOCHETS);
    addIconToCellRed(document.getElementById(`cell-${Rand(0,3)}-${pop(l)}`), PIECESR.SEMI_RICOCHETS);
    addIconToCellBlue(document.getElementById(`cell-${Rand(4,7)}-${pop(l)}`), PIECESB.RICOCHETS);
    addIconToCellBlue(document.getElementById(`cell-${Rand(4,7)}-${pop(l)}`), PIECESB.TANK);
    addIconToCellBlue(document.getElementById(`cell-${Rand(6,7)}-${pop(l)}`), PIECESB.CANNON);
    addIconToCellBlue(document.getElementById(`cell-7-${pop(l)}`), PIECESB.TITAN);
    addIconToCellBlue(document.getElementById(`cell-${Rand(4,7)}-${pop(l)}`), PIECESB.SEMI_RICOCHETS);
    l=[0,0,1,2,3,3,4,5,6,7]
}

let currentPlayer = 1;
let timer;
let turnDuration = 45;

function startGame() {
    initializeBoard();

    const allIcons = document.querySelectorAll('.iconR, .iconB');
    allIcons.forEach(icon => {
        icon.addEventListener('dragstart', dragStart);
        icon.addEventListener('click', rotateIcon); 
    });

    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', dragDrop);
    });

    startTurn();
}

let isPaused = false;
let remainingTime = turnDuration;


function startTurn() {
    clearInterval(timer);
    const turnDisplay = document.getElementById('turn-display');
    if(currentPlayer==1){
        turnDisplay.textContent = `${player1name}'s turn`;
    }
    else{
        turnDisplay.textContent = `${player2name}'s turn`;
    }
    

    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = `Time remaining: ${remainingTime}s`;

    timer = setInterval(() => {
        if (!isPaused) {
            remainingTime--;
            timerDisplay.textContent = `Time remaining: ${remainingTime}s`;
            if (remainingTime <= 0) {
                clearInterval(timer);
                endGameL(currentPlayer);
            }
        }
    }, 1000);

    const allIcons = document.querySelectorAll('.iconR, .iconB');
    const isPlayer1Turn = currentPlayer === 1;
    allIcons.forEach(icon => {
        const isOpponentPiece = (isPlayer1Turn && icon.classList.contains('iconB')) || (!isPlayer1Turn && icon.classList.contains('iconR'));
        icon.setAttribute('draggable', !isOpponentPiece);
    });
}


function switchTurn() {
    clearInterval(timer);
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    remainingTime = turnDuration; 
    shootCannonBullets(currentPlayer);
    startTurn();
}
function pauseTimer() {
    clearInterval(timer);
    timeRemaining = timer; 
}
function resumeTimer(display) {
    startTurn();
}
function resetGame() {
    
    initializeBoard();

    currentPlayer = 1;
    remainingTime = turnDuration;
    clearInterval(timer);

    
    startGame();
}


document.getElementById('pause-btn').addEventListener('click', pauseTimer);
document.getElementById('resume-btn').addEventListener('click', resumeTimer);

function dragStart(e) {
    const currentPlayerIconClass = currentPlayer === 1 ? 'iconR' : 'iconB';
    if (e.target.classList.contains(currentPlayerIconClass)) {
        startPositionId = e.target.closest('.cell').id;
        draggedElement = e.target;
        e.dataTransfer.setData('text/plain', '');
        e.dataTransfer.setDragImage(draggedElement, 0, 0);
    } else {
        
        e.preventDefault();
    }
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
        
        const initialPosition = draggedCell.id;
        const finalPosition = targetCell.id;

        
        
        targetCell.appendChild(draggedElement);
        playSoundEffect5();
        draggedCell.innerHTML = '';
        switchTurn();
    }
    targetCell.classList.remove('highlight');
}

function endGame(winner) {
   
    clearInterval(timer);
    window.location.href = `winner.html?winner=${winner},player1name=${player1name},player2name=${player2name}`;
}
function endGameL(loser) {
    let winner;
    if (loser == 1) {
        winner = 2;
        
    } else {
        winner = 1;
        
    }
    window.location.href = `winner.html?winner=${winner},player1name=${player1name},player2name=${player2name}`;
}

function pleasestartGame(){
    startGame()
};


function deflectBullet(type, ricoRotation, color, count, currentRow, currentCol, bullet, interval, deltaRow, deltaCol) {
    const isComingFromTop = deltaRow === -1;
    const isComingFromBottom = deltaRow === 1;
    const isComingFromLeft = deltaCol === -1;
    const isComingFromRight = deltaCol === 1;
    playSoundEffect4();
    



    const handleSemiHit = () => {
        
            
        
            const targetCell = document.getElementById(`cell-${currentRow}-${currentCol}`);
            const newCell = document.getElementById(`cell-${currentRow - 1}-${currentCol}`);
            const semi = targetCell.querySelector('.iconR#semi, .iconB#semi');
            changeElementId(semi, 'semi-hit', 'semi');
            playSoundEffect3();
            const interval2=setInterval(()=>{
                changeElementId(semi, 'semi-hit', 'semi');

            },1500)
            clearInterval(interval2)
            targetCell.removeChild(semi);
            targetCell.removeChild(bullet);
            clearInterval(interval);
            newCell.removeChild(bullet);
            
        
        
    }

    if (type === 'rico') {
        if (color === 'red') {
            if (ricoRotation % 180 === 0) {  
                if (isComingFromLeft) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromRight) {
                    deltaRow = -1;
                    deltaCol = 0;
                } else if (isComingFromTop) {
                    deltaRow = 0;
                    deltaCol = 1;
                } else if (isComingFromBottom) {
                    deltaRow = 0;
                    deltaCol = -1;
                }
            } else if (ricoRotation % 180 === 90) { 
                if (isComingFromLeft) {
                    deltaRow = -1;
                    deltaCol = 0;
                } else if (isComingFromRight) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromTop) {
                    deltaRow = 0;
                    deltaCol = -1;
                } else if (isComingFromBottom) {
                    deltaRow = 0;
                    deltaCol = 1;
                }
            }
        } else if (color === 'blue') {
            if (ricoRotation % 180 === 0) {  
                if (isComingFromLeft) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromRight) {
                    deltaRow = -1;
                    deltaCol = 0;
                } else if (isComingFromTop) {
                    deltaRow = 0;
                    deltaCol = 1;
                } else if (isComingFromBottom) {
                    deltaRow = 0;
                    deltaCol = -1;
                }
            } else if (ricoRotation % 180 === 90) { 
                if (isComingFromLeft) {
                    deltaRow = -1;
                    deltaCol = 0;
                } else if (isComingFromRight) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromTop) {
                    deltaRow = 0;
                    deltaCol = -1;
                } else if (isComingFromBottom) {
                    deltaRow = 0;
                    deltaCol = 1;
                }
            }
        }
    } else if (type === 'semi') {
        if (color === 'red') {
            if (ricoRotation === 0) { 
                if (isComingFromLeft) {
                    handleSemiHit();
                } else if (isComingFromRight) {
                    deltaRow=-1;
                    deltaCol=0;
                } else if (isComingFromBottom){
                    deltaRow=0;
                    deltaCol=-1
                    
                }
                else if (isComingFromTop) {
                    
                    handleSemiHit()
                } 
                
            } else if (ricoRotation === 90) {  
                if (isComingFromLeft) {
                    deltaRow=-1
                    deltaCol=0
                    
                    
                } else if (isComingFromRight || isComingFromTop) {
                    handleSemiHit();
                }
                else if(isComingFromBottom){
                    deltaRow=0
                    deltaCol=1;
                }
            }else if (ricoRotation === 180) {  
                if (isComingFromLeft) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromRight || isComingFromBottom) {
                    handleSemiHit();
                }
                else if(isComingFromTop){
                    deltaRow=0
                    deltaCol=1;
                }
            } 
            else if (ricoRotation === 270) { 
                if (isComingFromRight) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromLeft || isComingFromBottom) {
                    handleSemiHit();
                }
                else if(isComingFromTop){
                    deltaRow=0
                    deltaCol=-1;
                } 
                
            }
        } else if (color === 'blue') {
            if (ricoRotation === 0) { 
                if (isComingFromLeft) {
                    handleSemiHit();
                } else if (isComingFromRight) {
                    deltaRow=-1;
                    deltaCol=0;
                } else if (isComingFromBottom){
                    deltaRow=0;
                    deltaCol=-1
                    
                }
                else if (isComingFromTop) {
                    handleSemiHit()
                }
                
            } else if (ricoRotation === 90) { 
                if (isComingFromLeft) {
                    deltaRow=-1
                    deltaCol=0
                    
                    
                } else if (isComingFromRight || isComingFromTop) {
                    handleSemiHit();
                }
                else if(isComingFromBottom){
                    deltaRow=0
                    deltaCol=1;
                }
            }else if (ricoRotation === 180) { 
                if (isComingFromLeft) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromRight || isComingFromBottom) {
                    handleSemiHit();
                }
                else if(isComingFromTop){
                    deltaRow=0
                    deltaCol=1;
                }
            } 
            else if (ricoRotation === 270) { 
                if (isComingFromRight) {
                    deltaRow = 1;
                    deltaCol = 0;
                } else if (isComingFromLeft || isComingFromBottom) {
                    handleSemiHit();
                }
                else if(isComingFromTop){
                    deltaRow=0
                    deltaCol=-1;
                } 
                
            }
        }
    }

    return { newDeltaRow: deltaRow, newDeltaCol: deltaCol };
}


document.addEventListener('DOMContentLoaded', () => {
   
    const undoStackRed = [];
    const redoStackRed = [];
    const undoStackBlue = [];
    const redoStackBlue = [];

   
    function handleTileClick(event) {
        const tile = event.target;
        const row = tile.dataset.row;
        const col = tile.dataset.col;

    
        if (tile.dataset.points > 0 && tile.classList.contains(currentPlayer)) {
        
            if (currentPlayer === 'player1') {
                undoStackRed.push({ row, col, points: tile.dataset.points });
            } else {
                undoStackBlue.push({ row, col, points: tile.dataset.points });
            }

        
            updateTile(tile, row, col);

        
            switchPlayer();
        }
    }


    
    const updateTile = (tile, row, col) => {
      
        const points = parseInt(tile.dataset.points) + 1;
        tile.dataset.points = points;

        
        if (points >= 4) {
            
            tile.dataset.points = 0;

            
            tile.classList.remove('player1', 'player2');

          
            spreadColor(row, col);
        } else {
            
            tile.classList.add(currentPlayer);
        }
    };

    
    const spreadColor = (row, col) => {
        
        const directions = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
        directions.forEach((direction) => {
            const newRow = parseInt(row) + direction.row;
            const newCol = parseInt(col) + direction.col;
            const newTile = document.querySelector(`.tile[data-row="${newRow}"][data-col="${newCol}"]`);

            if (newTile) {
               
                updateTile(newTile, newRow, newCol);
            }
        });
    };

    

    
    const undoMove = () => {
        if (currentPlayer === 'player1' && undoStackRed.length > 0) {
            const lastMove = undoStackRed.pop();
            redoStackRed.push(lastMove);
            undoRedoHelper(lastMove, 'undo');
        } else if (currentPlayer === 'player2' && undoStackBlue.length > 0) {
            const lastMove = undoStackBlue.pop();
            redoStackBlue.push(lastMove);
            undoRedoHelper(lastMove, 'undo');
        }
    };

    
    const redoMove = () => {
        if (currentPlayer === 'player1' && redoStackRed.length > 0) {
            const lastMove = redoStackRed.pop();
            undoStackRed.push(lastMove);
            undoRedoHelper(lastMove, 'redo');
        } else if (currentPlayer === 'player2' && redoStackBlue.length > 0) {
            const lastMove = redoStackBlue.pop();
            undoStackBlue.push(lastMove);
            undoRedoHelper(lastMove, 'redo');
        }
    };

    
    const undoRedoHelper = (lastMove, action) => {
        const { row, col, points } = lastMove;
        const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
        if (action === 'undo') {
            tile.dataset.points = points - 1;
        } else if (action === 'redo') {
            tile.dataset.points = points;
        }
        updateTile(tile, row, col);
        switchPlayer();
    };

   
    document.getElementById('undo-btn').addEventListener('click', undoMove);
    document.getElementById('redo-btn').addEventListener('click', redoMove);
});
