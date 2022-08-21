import createElement from '../../helpers/createElement';
import { renderAuthorization } from '../../authorization/index';
import { headerRender } from './header';

export function openAuth() {
  const body = document.body;
  body.innerHTML = '';
  body.append(headerRender());
  renderAuthorization('body'); // вызов окна авторизации
}

export function headerAuth(login?: boolean) {
  const user = createElement('div', ['user']);
  if (!login) {
    user.innerHTML = '<i class="user__icon"></i><div class="user__data">ВОЙТИ</div>';
    user.onclick = () => openAuth();
  } else {
    //    сделать функционал для авторизованного пользователя
  }
  return user;
}