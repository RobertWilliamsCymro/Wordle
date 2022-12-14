const tileDisplay = document.querySelector('#tile-container') as HTMLDivElement;
const keyboard = document.querySelector('#key-container') as HTMLDivElement;
const messageDisplay = document.querySelector(
  '#message-container'
) as HTMLDivElement;

let currentRow = 0 as number;
let currentTile = 0 as number;
let isGameOver = false as boolean;

const wordle = 'super' as string;
const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'ENTER',
  'B',
  'N',
  'M',
  '<<',
] as string[];

const handleClick = (letter: string) => {
  if (letter === '<<') {
    deleteLetter();
    return;
  }
  if (letter === 'ENTER') {
    checkRow();
    return;
  }
  addLetter(letter);
};

const addLetter = (letter: string) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    ) as HTMLElement;
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    ) as HTMLElement;
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

const checkRow = () => {
  //below is a neat way of joining all individual values in array into one string
  const guess = guessRows[currentRow].join('');

  if (currentTile > 4) {
    flipTile();
    if (wordle.toUpperCase() === guess) {
      showMessage('Correct Answer!');
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = false;
        showMessage('Game Over');
        return;
      }
      if (currentRow <= 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message: string) => {
  const messageElement = document.createElement('p');
  messageElement.classList.value = 'm-0 p-10 rounded-lg';
  messageElement.textContent = message;
  //below code puts message into div tag
  messageDisplay.append(messageElement);
  //some asynchronus stuff  being used below
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

//below is a
const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
] as string[][];

guessRows.forEach((guessRow, guessRowIndex: number) => {
  const rowElement = document.createElement('div') as HTMLDivElement;
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);

  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div');
    tileElement.setAttribute(
      'id',
      'guessRow-' + guessRowIndex + '-tile-' + guessIndex
    );

    tileElement.classList.value =
      'm-2 w-[62px] h-[62px] bg-slate-500 border-solid border-slate-500';
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement('button') as HTMLButtonElement;
  buttonElement.classList.value =
    'w-[43px] h-[58px] m-4 rounded border-none bg-gray-500 [&:nth-child(28)]:w-[80px] [&:nth-child(24)]:w-[80px]';
  buttonElement.textContent = key;
  buttonElement.setAttribute('id', key);
  //callback function is needed here because we are using a parameter
  //without the () => the function will be called right away, have a look at asynch javascript to understand this better!
  buttonElement.addEventListener('click', () => handleClick(key));
  keyboard.append(buttonElement);
});

const addColourToKey = (keyLetter: string, colour: string) => {
  const key = document.getElementById(keyLetter) as HTMLElement;
  key.classList.add(colour);
};

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`)
    ?.childNodes as NodeListOf<HTMLElement>;
  let checkWordle: string = wordle;
  const guess: {letter?: string, colour: string}[] = [];

  // code below used to collect all data
  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data')?.toLowerCase(), colour: 'bg-red-700' });
  });

  guess.forEach((guess, index) => {
    if (guess.letter  === wordle[index]) {
      guess.colour = 'bg-green-700';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  guess.forEach((guess) => {
    if (typeof guess.letter === 'string') {
    if (checkWordle.includes(guess.letter)) {
      guess.colour = 'bg-yellow-700';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  }
  });

  rowTiles?.forEach((tile: HTMLElement, index: number) => {
    setTimeout(() => {
      tile.classList.value += ` ${guess[index].colour}`;
      const letterSelected = guess[index].letter?.toUpperCase() as string;
        addColourToKey(letterSelected, guess[index].colour);      
    }, 500 * index);
  });
};
export {};
