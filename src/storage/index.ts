import { StatisticGameStore } from '../types/index';
import { User } from '../types/User';

const storage = window.localStorage;

export function getStore(): User | undefined {
  const userStr = storage.getItem('user');
  if (userStr) return JSON.parse(userStr) as User;
}

export function setStore(user: User) {
  const userStr = {
    name: user.name,
    email: user.email,
    id: user.id,
    token: user.token,
  };
  storage.setItem('user', JSON.stringify(userStr));
}
export function clearUserStore() {
  storage.removeItem('user');
  window.location.reload();
}

export function getStoreGame(): StatisticGameStore | undefined {
  const game = storage.getItem('gameStatistic');
  if (game) return JSON.parse(game) as StatisticGameStore;
}

export function setStoreGame(gameStat: StatisticGameStore) {
  storage.setItem('gameStatistic', JSON.stringify(gameStat));
}

//TODO: сделать удаление обьекта из локал сторадж при локауте
export function removeStore() {
  storage.removeItem('user');
  storage.removeItem('gameStat');
}
