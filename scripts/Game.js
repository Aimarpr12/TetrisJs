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
    pause() {
        this.isPlaying = false;
        clearInterval(this.timerId); // Pausar el juego
        this.timerId = null;
    }
    start() {
        if (this.isPlaying) return;  // Evitar múltiples inicios
        this.isPlaying = true;
    
        // Si no hay ficha actual, generar la primera ficha
        if (!this.currentTetromino) {
            this.spawnNewTetromino();
        }
    
        // Iniciar el movimiento de las piezas hacia abajo cada 1 segundo
        this.timerId = setInterval(() => this.moveDown(), 1000); // Cada 1000 ms (1 segundo)
    }
    
    dropPiece() {
        // Hacer que la pieza baje hasta que no pueda moverse más
        while (!this.currentTetromino.freeze(this.squares)) {
            this.currentTetromino.moveDown(this.squares);
        }
        
        // Una vez que no puede moverse más, congelar la pieza y generar una nueva
        this.freezeTetromino();
        this.spawnNewTetromino();
    }

    moveDown() {
        this.currentTetromino.moveDown(this.squares);

        // Si el tetromino llega al fondo o choca, congelarlo y generar uno nuevo
        if (this.currentTetromino.freeze(this.squares)) {
            this.freezeTetromino();
            this.spawnNewTetromino();
        }
    }

    moveLeft() {
        this.currentTetromino.undraw(this.squares);
        const newPosition = this.currentTetromino.position - 1;

        if (!this.isAtLeftEdge(newPosition)) {
            this.currentTetromino.position = newPosition;
        }
        
        this.currentTetromino.draw(this.squares);
    }

    moveRight() {
        this.currentTetromino.undraw(this.squares);
        const newPosition = this.currentTetromino.position + 1;

        if (!this.isAtRightEdge(newPosition)) {
            this.currentTetromino.position = newPosition;
        }
        
        this.currentTetromino.draw(this.squares);
    }

    rotate() {
        debugger;
        this.currentTetromino.rotate(this.squares);  // Llamar al método de rotación del tetromino
    }

    freezeTetromino() {
        this.currentTetromino.shape[this.currentTetromino.rotationIndex].forEach(index => {
            const gridIndex = this.currentTetromino.position + index;
            this.squares[gridIndex].classList.add('taken');
            this.squares[gridIndex].style.backgroundColor = this.currentTetromino.color;  // Mantener el color del tetromino
        });
        this.checkForFullRows();
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
    
        // Las piezas están diseñadas para una cuadrícula de 10 columnas,
        // necesitamos ajustar los índices para una cuadrícula de 4x4.
        this.nextTetromino.shape[0].forEach(index => {
            // Transformar los índices para que se ajusten a la cuadrícula de 4x4
            const adjustedIndex = this.adjustIndexForNextGrid(index);
            if (adjustedIndex >= 0 && adjustedIndex < 16) {  // Verificar que el índice esté dentro del rango de la cuadrícula 4x4
                this.nextSquares[adjustedIndex].classList.add('tetromino');
                this.nextSquares[adjustedIndex].style.backgroundColor = this.nextTetromino.color;  // Aplicar el color de la ficha
            }
        });
    }

    adjustIndexForNextGrid(index) {
        // La cuadrícula de juego tiene 10 columnas, pero la cuadrícula de vista previa tiene 4 columnas.
        // Necesitamos ajustar los índices para que se dibujen correctamente en la vista previa (4x4).
        
        // Convertir el índice para que encaje en una cuadrícula de 4x4 en lugar de 10x20
        const row = Math.floor(index / 10);  // Fila original de la cuadrícula de 10 columnas
        const col = index % 10;              // Columna original en la cuadrícula de 10 columnas
    
        // Si la columna está fuera de la cuadrícula de 4 columnas, ignorar esa parte del tetromino
        if (col >= 4) return -1;  // Índices que se salen del rango de 4 columnas no son válidos
    
        // Ajustar el índice para una cuadrícula de 4 columnas
        return row * 4 + col;
    }

    spawnNewTetromino() {
        this.currentTetromino = this.nextTetromino;  // La ficha siguiente pasa a ser la actual
        this.currentTetromino.draw(this.squares);  // Dibujar la ficha actual

        this.nextTetromino = this.generateRandomTetromino();  // Generar una nueva ficha como "siguiente"
        this.showNextTetromino();  // Mostrar la próxima ficha en el área de vista previa
    }

    isAtLeftEdge(newPosition) {
        return this.currentTetromino.shape[this.currentTetromino.rotationIndex].some(index =>
            ((newPosition +1) + index) % 10 === 0  // Verificar si está en el borde izquierdo
        );
    }

    isAtRightEdge(newPosition) {
        return this.currentTetromino.shape[this.currentTetromino.rotationIndex].some(index =>
            ((newPosition -1)+ index) % 10 === 9  // Verificar si está en el borde derecho
        );
    }

    // Método para verificar si hay filas completas y eliminarlas
    checkForFullRows() {
        for (let row = 0; row < 20; row++) {
            let isRowFull = true;
            for (let col = 0; col < 10; col++) {
                if (!this.squares[row * 10 + col].classList.contains('taken')) {
                    isRowFull = false;
                    break;
                }
            }

            if (isRowFull) {
                this.removeRow(row);
                this.addScore();
            }
        }
    }

    // Método para eliminar una fila completa
    removeRow(row) {
        for (let col = 0; col < 10; col++) {
            this.squares[row * 10 + col].classList.remove('taken', 'tetromino');
            this.squares[row * 10 + col].style.backgroundColor = '';  // Eliminar el color
        }

        // Mover todas las filas de arriba hacia abajo
        const removedSquares = this.squares.splice(row * 10, 10);
        this.squares = removedSquares.concat(this.squares);
        this.grid.innerHTML = '';  // Limpiar el grid actual

        // Volver a dibujar la cuadrícula
        this.squares.forEach(square => this.grid.appendChild(square));
    }

    // Método para sumar puntos al eliminar una fila
    addScore() {
        this.score += 100;
        this.scoreDisplay.textContent = this.score;
    }
}
