function login(event) {
    event.preventDefault(); 
    const player1name = document.getElementById("player1").value;
    const player2name = document.getElementById("player2").value;
    window.location.href = `proj.html?player1=${player1name}&player2=${player2name}`;
}