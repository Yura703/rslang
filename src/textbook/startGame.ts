import { startAudioCall } from '../games/logicGames/logicAudioCall';
import { getWordsByCategory, startSprint } from '../games/logicGames/logicSprint';
import { routing } from '../routing/routing';
import requestMethods from '../services/requestMethods';
import { getStore } from '../storage';
import { User } from '../types/User';
import { UserWordInterface, WordInterface } from '../types/wordInterface';

//получение ID слов 'learned'
async function getIdLearnedWords() {
  const user: User | undefined = getStore();

  if (user) {
    const userWord = (await requestMethods().getAllUserWords(user.id, user.token)) as UserWordInterface[];
    //TODO: сделать логику при протухшем токене

    const arr: string[] = [];
    for (let i = 0; i < userWord.length; i++) {
      if (userWord[i].difficulty === 'learned') arr.push(userWord[i].wordId);
    }
    console.log(arr);

    return arr;
  }

  return;
}

async function getWordsForGame(level: number, page: number) {
  const words = await getWordsByCategory(level, page);

  const wordsUserId = await getIdLearnedWords();

  if (wordsUserId && wordsUserId.length > 0) {
    return words.filter((word: WordInterface) => {
      const indexWord = wordsUserId.indexOf(word.id);
      return indexWord === -1;
    });
  } else {
    return words;
  }
}

async function startGame(sprintOrAudioCall: boolean) {
  const levelStr = (document.querySelector('select.textbook__select') as HTMLSelectElement).value;
  const level = levelStr.slice(-1);
  const page = (document.querySelector('span.textbook__current-page') as HTMLElement).innerText;

  const words = await getWordsForGame(+level, +page);
  const wordsFromEnd = words.reverse();
  console.log(words.length);

  if (sprintOrAudioCall) {
    void startSprint(wordsFromEnd);
  } else {
    void startAudioCall(wordsFromEnd);
  }
}

export function addListenerForStartGame() {
  const btnGameBook = document.querySelectorAll('div.textbook__game-list > *');

  btnGameBook[0].addEventListener('click', () => {
    void startGame(false);
    routing('/audio-call');
  });

  btnGameBook[1].addEventListener('click', () => {
    void startGame(true);
    routing('/sprint');
  });
}