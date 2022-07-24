//Objeto que cuida da visualização do game, mostra frases com a interação do usuário e os palpites no tabuleiro
var view = {
    displayMessage: (msg) => {
        document.getElementById("messageArea").innerHTML = msg
    },
    displayHit: (location) => {
        document.getElementById(location).setAttribute("class", "hit")
    },
    displayMiss: (location) => {
        document.getElementById(location).setAttribute("class", "miss")
    }
}

//Objeto que cuida das regras e da lógica do game. De forma dinâmica, manipula através do DOM os palpites do usuário
var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] }],
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            var index = ship.locations.indexOf(guess)
            if (index != -1) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {
                    view.displayMessage("Você derrubou meu navio!")
                    this.shipsSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage("EROOOOOOOOOU!")
        return false
    },
    isSunk: function(ship) {
        for (i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") return false
        }
        return true
    },
    generateShipLocations: function(){
        var locations
        for(var i=0; i<this.numShips; i++){
            do{
                locations = this.generateShip()
            }while(this.collision(locations))
            this.ships[i].locations = locations
        }
    },
    generateShip: function(){
        var direction = Math.floor(Math.random() * 2)
        var row, col
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize-this.shipLength))
        }
        else {
            row = Math.floor(Math.random() * (this.boardSize-this.shipLength))
            col = Math.floor(Math.random() * this.boardSize)
        }
        var newShipLocations = []
        for (var i = 0; i < this.shipLength; i++){
            direction == 1 ? newShipLocations.push(row + "" + (col+i)) : newShipLocations.push((row+i) + "" + col)
        }
        return newShipLocations
    },
    collision: function(locations){
        for(var i = 0; i < this.numShips; i++){
            var ship = model.ships[i]
            for(var j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) != -1) return true
            }
        }
        return false
    }
}

//Objeto de controle do game, processa o palpite para quando termina a partida
var controller = {
    guesses: 0,
    processGuess: function(guess){
        var location = parseGuess(guess, context)
        if (location){
            this.guesses++
            var hit = model.fire(location)
            if(hit && model.shipsSunk === model.numShips) view.displayMessage(`Você afundou todos os meus navios em ${this.guesses} palpites!`)
        }
    }
}

//Função que transforma palpite com string números e validação do mesmo
var context = { guesses: []}
function parseGuess(guess, context){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if(guess === null || guess.length !== 2) alert("Ops, comece com uma Letra e um Número!")
    else{
        var firstChar = guess.charAt(0)
        var row = alphabet.indexOf(firstChar)
        var column = guess.charAt(1)

        if (isNaN(column)) alert("Ops, isso não está no mapa")
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) alert("Ops, está fora do mapa")
        else if (context.guesses.includes(row + column)) alert("Ops, palpite repetido!")
        else {
            context.guesses.push(row + column)
            return row + column
        }
    }
    return null
}

//Função para enviar palpite clicando botão Fire!
function handleFireButton(){
    var guess = document.getElementById("guessInput").value
    controller.processGuess(guess)

    guessInput.value = ""
}

//Função para enviar palpite apertando "ENTER"
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton")
    if(e.keyCode === 13){
        fireButton.click()
        document.getElementById("guessInput").value = ""
        return false
    }
}

function init(){
    document.getElementById("fireButton").onclick = handleFireButton;
    document.getElementById("guessInput").onkeypress = handleKeyPress

    model.generateShipLocations()
}

window.onload = init