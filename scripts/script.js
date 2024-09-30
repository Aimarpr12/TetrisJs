import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');

    // Crear la cuadrícula de 200 celdas (10 columnas x 20 filas)
    for (let i = 0; i < 200; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    }

    const game = new Game(grid, scoreDisplay);

    // Evento para el botón de inicio/pausa
    startButton.addEventListener('click', () => {
        if (game.isPlaying) {
            game.pause();
            startButton.textContent = "Reanudar Juego";
        } else {
            game.start();
            startButton.textContent = "Pausar Juego";
        }
    });

    // Capturar las teclas de dirección y prevenir el scroll
    document.addEventListener('keydown', (event) => {
        debugger;
        if (!game.isPlaying) return;  // Solo se mueven las piezas cuando el juego está en marcha

        // Prevenir el comportamiento predeterminado de las teclas de flecha
        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
        }

        // Mover las piezas con las teclas
        if (event.key === 'ArrowLeft') {
            game.moveLeft();  // Mover el tetromino a la izquierda
        } else if (event.key === 'ArrowRight') {
            game.moveRight();  // Mover el tetromino a la derecha
        } else if (event.key === 'ArrowDown') {
            game.moveDown();  // Hacer que el tetromino caiga más rápido
        } else if (event.key === 'ArrowUp') {
            game.rotate();  // Rotar el tetromino
        } else if (event.code === 'Space') {
            event.preventDefault();  // Prevenir el comportamiento predeterminado del navegador
            game.dropPiece();  // Hacer que la pieza caiga hasta el fondo
        } else if (event.code === 'Escape') {
            if (game.isPlaying) {
                game.pause();  // Pausar el juego si está en marcha
                startButton.textContent = "Reanudar Juego";
            }
        }
    });
});
