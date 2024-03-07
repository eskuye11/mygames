window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const playerTurn = document.querySelector('.display');
    const gameover = document.querySelector('.gameOver');
    const ressetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.annoucer');
    const backgroundElm = document.getElementById('background')

    let board = Array(9).fill('');
    let currentPlayer = 'X'
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE'

    const winnings = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    tiles.forEach((box) => {
        box.addEventListener('mouseenter', (e) => {
            if (e.target.innerText === '' && isGameActive) {
                box.setAttribute('data-foo', currentPlayer)
            } else {
                box.setAttribute('data-foo', '')
            };
        })
        box.addEventListener('mouseleave', () => {
            box.removeAttribute('data-foo')
        })
    })

    function endMessage() {
        gameover.style.display = 'block'
        playerTurn.style.display = 'none'

    }

    function handlerResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winBox = winnings[i];
            let winRow = [board[winBox[0]], board[winBox[1]], board[winBox[2]]]
            if (winRow.some(x => x === '')) {
                continue
            }
            if (winRow.every(x => x === winRow[0])) {
                roundWon = true;
                let classOne = 'cl' + winBox[0];
                let classtwo = 'cl' + winBox[1];
                let classthr = 'cl' + winBox[2];
                document.querySelector(`.${classOne}`).style.backgroundColor = 'orange';
                document.querySelector(`.${classtwo}`).style.backgroundColor = 'orange';
                document.querySelector(`.${classthr}`).style.backgroundColor = 'orange';
                endMessage()
                break;
            };
        };

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
        if (!board.includes('') && isGameActive) {
            announce(TIE);
            endMessage()
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = `player <span class="playerO">O</span> Won !`;
                break;
            case PLAYERX_WON:
                announcer.innerHTML = `player <span class="playerX">X</span> won !`;
                break;
            case TIE:
                announcer.innerText = 'Tie';
                backgroundElm.style.backgroundColor = 'orange'
        }
        announcer.classList.remove('hide');
        announcer.style.color = 'orange'
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        };
        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handlerResultValidation();
            changePlayer();
        };
    };

    const resetBoard = () => {
        board = Array(9).fill('');
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer === 'O') {
            changePlayer();
        }
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
            tile.style.backgroundColor = '#555'
        });
        gameover.style.display = 'none'
        playerTurn.style.display = 'block'
        backgroundElm.style.backgroundColor = ''
    };

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    ressetButton.addEventListener('click', resetBoard);
});