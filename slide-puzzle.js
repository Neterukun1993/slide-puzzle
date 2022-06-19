class InnerBoard {
    constructor(_size) {
        this._size = _size;
        this._slideCounter = 0;
        this.board = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            this.board[i] = new Array(this.size);
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = (this.size * i + j) + 1;
            }
        }
    }
    get size() {
        return this._size;
    }
    get slideCounter() {
        return this._slideCounter;
    }
    isComplete() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] != (this.size * i + j) + 1) {
                    return false;
                }
            }
        }
        return true;
    }
    isEmptyBlock(i, j) {
        return this.board[i][j] == this.size * this.size;
    }
    blockValue(i, j) {
        return this.board[i][j];
    }
    slideBlock(i, j) {
        const di = [0, 0, 1, -1];
        const dj = [1, -1, 0, 0];
        for (let k = 0; k < 4; k++) {
            const next_i = i + di[k];
            const next_j = j + dj[k];
            if (next_i < 0 || this.size <= next_i) continue;
            if (next_j < 0 || this.size <= next_j) continue;
            if (this.isEmptyBlock(next_i, next_j)) {
                // slide block
                [this.board[i][j], this.board[next_i][next_j]] = [this.board[next_i][next_j], this.board[i][j]];
                this._slideCounter += 1;
                break;
            }
        }
    }
    shuffleBlocks() {
        let i0, j0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.isEmptyBlock(i, j)) {
                    [i0, j0] = [i, j];
                }
            }
        }
        const di = [0, 0, 1, -1];
        const dj = [1, -1, 0, 0];
        for (let count = 0; count < 10 ** 4; count++) {
            let k = Math.floor(Math.random() * 4);
            const next_i0 = i0 + di[k];
            const next_j0 = j0 + dj[k];
            if (next_i0 < 0 || this.size <= next_i0) continue;
            if (next_j0 < 0 || this.size <= next_j0) continue;
            // slide block
            [this.board[i0][j0], this.board[next_i0][next_j0]] = [this.board[next_i0][next_j0], this.board[i0][j0]];
            [i0, j0] = [next_i0, next_j0];
        }
        this._slideCounter = 0;
    }
    directionToEmpty(i, j) {
        const translateArray = [
            "translate(60px, 0px)",
            "translate(-60px, 0px)",
            "translate(0px, 60px)",
            "translate(0px, -60px)"
        ];
        const di = [0, 0, 1, -1];
        const dj = [1, -1, 0, 0];
        for (let k = 0; k < 4; k++) {
            const next_i = i + di[k];
            const next_j = j + dj[k];
            if (next_i < 0 || this.size <= next_i) continue;
            if (next_j < 0 || this.size <= next_j) continue;
            if (this.isEmptyBlock(next_i, next_j)) return translateArray[k];
        }
        return "";
    }
}


function initializePuzzleBoard(board) {
    const table = document.createElement("table");
    table.id = "blocks";

    for (let i = 0; i < board.size; i++){
        const row = table.insertRow();
        for(let j = 0; j < board.size; j++){
            const cell = row.insertCell();

            if (board.isEmptyBlock(i, j)) {
                cell.className = "empty";
            } else {
                cell.className = "block";
                cell.innerHTML = board.blockValue(i, j);
            }
        }
    }
    document.getElementById("blocks").remove();
    document.getElementById("puzzle-board").appendChild(table);
}


function updatePuzzleBoard(board) {
    const table = document.createElement("table");
    table.id = "blocks";

    for (let i = 0; i < board.size; i++){
        const row = table.insertRow();
        for(let j = 0; j < board.size; j++){
            const cell = row.insertCell();

            if (board.isEmptyBlock(i, j)) {
                cell.className = "empty";
            } else {
                cell.className = "block";
                cell.innerHTML = board.blockValue(i, j);
            }

            if (board.directionToEmpty(i, j) == "") continue;

            cell.addEventListener("click", () => {
                const effect = new KeyframeEffect(
                    cell,
                    [{ transform: "translate(0px, 0px)" }, { transform: board.directionToEmpty(i, j) }],
                    { duration: 50 }
                );
                const animation = new Animation(effect);
                animation.onfinish = () => {
                    board.slideBlock(i, j);
                    updatePuzzleBoard(board);
                }
                animation.play();
            });
        }
    }
    document.getElementById("counter").innerHTML = board.slideCounter;
    document.getElementById("blocks").remove();
    document.getElementById("puzzle-board").appendChild(table);
    if (board.isComplete()) {
        document.getElementById("counter").className = "finish";
        document.getElementById("counter").innerHTML += "(complete)";
    }
}


const size = 4;
const board = new InnerBoard(size);
const startButton = document.querySelector("#start");


window.addEventListener('load', () => {
    initializePuzzleBoard(board);
});


startButton.addEventListener('click', () => {
    document.getElementById("counter").className = "";
    board.shuffleBlocks();
    updatePuzzleBoard(board);
});