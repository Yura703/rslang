import '../games.scss';

import createElement from '../../helpers/createElement';
import appendChildArray from '../../helpers/appendChildArray';
import { eventListener } from '../logicGames/logicSprint';
import { setLocation } from '../../routing/routing';
import { eventKeyUpAudioCall } from '../logicGames/logicAudioCall';

function renderButtonGroup() {
  const questBtn = createElement('div', ['audio-call-quest__btn']);

  for (let i = 0; i < 6; i++) {
    //const questBtnNum = createElement('button', ['btn-audio-call']);
    const questBtnNum = createElement('button', ['btn-audio-call']);

    questBtn.appendChild(questBtnNum);
  }

  return questBtn;
}

function renderQuestGroup() {
  const quest = createElement('div', ['audio-call-quest']);

  const status = createElement('div', ['audio-call-quest__status']);
  appendChildArray(status, [
    createElement('div'),
    createElement('div'),
    createElement('div'),
    createElement('div'),
    createElement('div'),
  ]);

  const btnSound = createElement('div', ['audio-call-quest__sound'], '', 'call-sound');
  btnSound.dataset.sound = 'on';

  const questBtn = renderButtonGroup();

  appendChildArray(quest, [status, btnSound, questBtn]);

  return quest;
}

export function renderAudioCallGame(target: HTMLElement | string) {
  const container = createElement('div', ['game-container', 'audio-call-game-container']);

  const btnSound = createElement('div', ['sprint-sound'], '', 'sprint-sound');
  // const soundIcon = createElement('img', undefined, undefined, 'sprint-sound') as HTMLImageElement;
  /// soundIcon.src = '../assets/images/sound.png';
  btnSound.dataset.sound = 'on';
  // btnSound.appendChild(soundIcon);

  const btnClose = createElement('div', ['btn-close']);
  btnClose.onclick = () => {
    setLocation('games');
    container.remove();
  };

  appendChildArray(container, [btnSound, btnClose, renderQuestGroup()]);

  if (typeof target === 'string') {
    document.querySelector(target)?.appendChild(container);
  } else {
    target.appendChild(container);
  }

  eventListener('div.audio-call-game-container');
  eventKeyUpAudioCall();
}
