const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const winner = urlParams.get('winner');
const player1name=urlParams.get('player1name') ?? 'Player 1'
const player2name=urlParams.get('player2name') ?? 'Player 2'


if(winner==1){
    document.getElementById("winner").textContent = `${player1name} is the winner`;

}
else{
    document.getElementById("winner").textContent = `${player2name} is the winner`;
}


function playAgain(event) {
    window.location.href = `proj.html?`;
}

const style = document.createElement('style');

if (winner == 1) {
    style.innerHTML = `
    #image2 {
        display: flex;
        background-image: url(player1shooter.jpg);
        background-repeat: no-repeat;
        height: 169px;
        margin-left: 40px;
    }
    `;
} else {
    style.innerHTML = `
    #image2 {
        display: flex;
        background-image: url(shootergreen.jpg);
        background-repeat: no-repeat;
        height: 169px;
    }
    `;
}

document.head.appendChild(style);
