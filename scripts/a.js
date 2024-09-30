import { Tetromino, tetrominoes } from './Tetromino.js';

export class Game {
    constructor(grid, scoreDisplay) {
        this.grid = grid;
        this.squares = Array.from(this.grid.querySelectorAll('div'));
        this.scoreDisplay = scoreDisplay;
        this.nextTetrominoGrid = document.querySelector('.next-tetromino-grid');  // Contenedor para la ficha siguiente
        this.currentTetromino = null;  // Ficha actual
        this.nextTetromino = this.generateRandomTetromino();  // Ficha siguiente
        this.timerId = null;
        this.score = 0;
        this.isPlaying = false;

        // Crear las celdas para mostrar la ficha siguiente
        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            this.nextTetrominoGrid.appendChild(square);
        }
        this.nextSquares = Array.from(this.nextTetrominoGrid.querySelectorAll('div'));
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        this.spawnNewTetromino();  // Generar la primera ficha

        // Iniciar el movimiento de las piezas hacia abajo cada 1 segundo
        this.timerId = setInterval(() => this.moveDown(), 1000);
    }

    moveDown() {
        this.currentTetromino.moveDown(this.squares);

        // Si la ficha actual llega al fondo o toca otra ficha congelada
        if (this.currentTetromino.freeze(this.squares)) {
            this.freezeTetromino();
            this.spawnNewTetromino();  // Generar la siguiente ficha
        }
    }

    spawnNewTetromino() {
        this.currentTetromino = this.nextTetromino;  // La ficha siguiente pasa a ser la actual
        this.currentTetromino.draw(this.squares);  // Dibujar la ficha actual

        this.nextTetromino = this.generateRandomTetromino();  // Generar una nueva ficha como "siguiente"
        this.showNextTetromino();  // Mostrar la próxima ficha en el área de vista previa
    }

    // Generar una ficha aleatoria
    generateRandomTetromino() {
        const random = Math.floor(Math.random() * tetrominoes.length);
        const tetromino = tetrominoes[random];
        return new Tetromino(tetromino.shape, 4, tetromino.color);
    }

    // Mostrar la próxima ficha en el área de vista previa
    showNextTetromino() {
        this.nextSquares.forEach(square => {
            square.style.backgroundColor = '';  // Limpiar el color anterior
            square.classList.remove('tetromino');
        });

        this.nextTetromino.shape[0].forEach(index => {
            this.nextSquares[index].classList.add('tetromino');
            this.nextSquares[index].style.backgroundColor = this.nextTetromino.color;  // Aplicar el color de la ficha
        });
    }

    freezeTetromino() {
        this.currentTetromino.shape[this.currentTetromino.rotationIndex].forEach(index => {
            const gridIndex = this.currentTetromino.position + index;
            this.squares[gridIndex].classList.add('taken');
            this.squares[gridIndex].style.backgroundColor = this.currentTetromino.color;  // Mantener el color de la ficha congelada
        });
    }
}
