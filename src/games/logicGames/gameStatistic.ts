import { SprintResult } from '../../types';
import { getStore } from '../../storage';
import requestMethods from '../../services/requestMethods';
import { DataForStatistic, Statistic, WordStatistic } from '../../types/Statistic';
import { DataForUserWord, UserWordOptions } from '../../types/UserWordOptions';
import { newWordEmpty } from '../../textbook/createWordElement';
import { User } from '../../types/User';

function updateStatisticGame(stat: WordStatistic, correct: number, error: number, series?: number[]) {
  if (series) {
    stat.longSeries = Math.max(stat.longSeries || 0, ...series);
  }
  stat.correct = (stat.correct || 0) + correct;
  stat.errors = (stat.errors || 0) + error;
}

async function updateWordGameStat(user: User, result: SprintResult[], gameName: string, userStatistic: Statistic) {
  const isSprint = gameName === 'sprint';
  const allWords = (await requestMethods().getAllUserWords(user.id, user.token)) as DataForUserWord[];
  for (const i of result) {
    if (allWords.some((e) => e.wordId === i.wordID)) {
      await requestMethods()
        .getUserWordById(user.id, i.wordID, user.token)
        .then((e) => {
          const wordGameData = e.optional || newWordEmpty;
          wordGameData.count += 1;
          wordGameData.longSeries = i.result ? wordGameData.longSeries + 1 : 0;
          wordGameData.audioCorrect += Number(i.result && !isSprint);
          wordGameData.audioError += Number(!i.result && !isSprint);
          wordGameData.sprintCorrect += Number(i.result && isSprint);
          wordGameData.sprintError += Number(!i.result && isSprint);

          let status = 'added';
          if (e.difficulty === 'complicated') status = 'complicated';
          if (
            (wordGameData.longSeries > 2 && e.difficulty === 'added') ||
            (wordGameData.longSeries > 4 && e.difficulty === 'complicated') ||
            (i.result && e.difficulty === 'learned')
          ) {
            status = 'learned';
            userStatistic.today.studied += 1;
            if (isSprint) userStatistic.sprint.studied += 1;
            else userStatistic.audioCall.studied += 1;
          }
          void requestMethods().updateUserWord(user.id, i.wordID, status, user.token, wordGameData);
        });
    } else {
      const wordGameData: UserWordOptions = {
        count: 1,
        longSeries: Number(i.result),
        audioCorrect: Number(i.result && !isSprint),
        audioError: Number(!i.result && !isSprint),
        sprintCorrect: Number(i.result && isSprint),
        sprintError: Number(!i.result && isSprint),
      };
      userStatistic.today.added = (userStatistic.today.added || 0) + 1;
      if (isSprint) userStatistic.sprint.added = (userStatistic.sprint.added || 0) + 1;
      else userStatistic.audioCall.added = (userStatistic.audioCall.added || 0) + 1;
      await requestMethods().createUserWord(user.id, i.wordID, 'added', user.token, wordGameData);
    }
  }
}

export async function addStatisticGame(resultsSprint: SprintResult[], gameName: string) {
  const user = getStore();
  if (user) {
    let thisSeries = 0;
    const allSeries: number[] = [];
    const correctCount = resultsSprint.reduce((s, c) => s + Number(c.result), 0);
    const errorCount = resultsSprint.reduce((s, c) => s + Number(!c.result), 0);
    for (const i of resultsSprint) {
      if (i.result) thisSeries += 1;
      else {
        allSeries.push(thisSeries);
        thisSeries = 0;
      }
      allSeries.push(thisSeries);
    }

    const userStatisticResponse = (await requestMethods().getUserStatistic(user.id, user.token)) as DataForStatistic;
    const userStatistic = userStatisticResponse.optional.statistics;
    await updateWordGameStat(user, resultsSprint, gameName, userStatistic);
    updateStatisticGame(userStatistic.today, correctCount, errorCount);
    if (gameName === 'sprint') {
      updateStatisticGame(userStatistic.sprint, correctCount, errorCount, allSeries);
    } else {
      updateStatisticGame(userStatistic.audioCall, correctCount, errorCount, allSeries);
    }
    await requestMethods().updateUserStatistic(user.id, '1', user.token, { statistics: userStatistic });
  }
}
