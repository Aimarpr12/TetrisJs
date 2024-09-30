export class Tetromino {
    constructor(shape, position, color) {
        this.shape = shape;
        this.position = position;
        this.rotationIndex = 0;
        this.color = color;  // Almacena el color del tetromino
    }

    draw(grid) {
        this.shape[this.rotationIndex].forEach(index => {
            const gridIndex = this.position + index;
            if (gridIndex >= 0 && gridIndex < 200) {
                grid[gridIndex].classList.add('tetromino');
                grid[gridIndex].style.backgroundColor = this.color;  // Aplica el color del tetromino
            }
        });
    }

    undraw(grid) {
        this.shape[this.rotationIndex].forEach(index => {
            const gridIndex = this.position + index;
            if (gridIndex >= 0 && gridIndex < 200) {
                grid[gridIndex].classList.remove('tetromino');
                grid[gridIndex].style.backgroundColor = '';  // Limpia el color
            }
        });
    }

    // Método para mover el tetromino hacia abajo
    moveDown(grid) {
        this.undraw(grid);  // Borrar el tetromino de la posición actual
        this.position += 10;  // Mover el tetromino hacia abajo (una fila más)
        this.draw(grid);  // Dibujar el tetromino en la nueva posición
    }

    // Método para rotar el tetromino
    rotate(grid) {
        this.undraw(grid);
        this.rotationIndex = (this.rotationIndex + 1) % this.shape.length;  // Cambiar la rotación
        this.draw(grid);
    }

    // Método para verificar si el tetromino ha llegado al fondo
    freeze(grid) {
        // Verificar si alguna parte del tetromino llega al fondo o toca una pieza congelada
        return this.shape[this.rotationIndex].some(index => {
            const nextPosition = this.position + index + 10;  // Posición una fila hacia abajo
            // Si el índice está fuera de los límites (parte inferior) o si toca una pieza congelada
            return nextPosition >= 200 || grid[nextPosition].classList.contains('taken');
        });
    }
    
}

export const tetrominoes = [
    {
        name: "L",
        shape: [
            [1, 11, 21, 2],
            [10, 11, 12, 22],
            [1, 11, 21, 20],
            [10, 20, 21, 22]
        ],
        color: "#f39c12"  // Color naranja para la pieza L
    },
    {
        name: "Z",
        shape: [
            [0, 10, 11, 21],
            [10, 11, 1, 2],
            [0, 10, 11, 21],
            [10, 11, 1, 2]
        ],
        color: "#e74c3c"  // Color rojo para la pieza Z
    },
    {
        name: "T",
        shape: [
            [1, 10, 11, 12],
            [1, 11, 12, 21],
            [10, 11, 12, 21],
            [1, 10, 11, 21]
        ],
        color: "#9b59b6"  // Color púrpura para la pieza T
    },
    {
        name: "O",
        shape: [
            [0, 1, 10, 11],
            [0, 1, 10, 11],
            [0, 1, 10, 11],
            [0, 1, 10, 11]
        ],
        color: "#f1c40f"  // Color amarillo para la pieza O
    },
    {
        name: "I",
        shape: [
            [1, 11, 21, 31],
            [10, 11, 12, 13],
            [1, 11, 21, 31],
            [10, 11, 12, 13]
        ],
        color: "#1abc9c"  // Color turquesa para la pieza I
    },
    {
        name: "S",
        shape: [
            [1, 11, 12, 22],
            [0, 1, 11, 12],
            [1, 11, 12, 22],
            [0, 1, 11, 12]
        ],
        color: "#2ecc71"  // Color verde para la pieza S
    },
    {
        name: "J",
        shape: [
            [1, 11, 21, 22],
            [10, 11, 12, 20],
            [0, 1, 11, 21],
            [2, 10, 11, 12]
        ],
        color: "#3498db"  // Color azul para la pieza J
    }
];
