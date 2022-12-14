import createElement from '../helpers/createElement';
import { headerRender } from './header/header';
import { sidebarRender } from './sidebar/sidebar';
import { footerRender } from './footer/footer';

export function pageBaseMarkup() {
  const body = document.body;
  let page: HTMLElement | null = body.querySelector('.page-wrapper');
  if (page) page.innerHTML = '';
  else {
    page = createElement('div', ['page-wrapper']);
    body.append(page);
  }
  return page;
}

export function pageRender(renderInner: (opt?: string) => void, activeTabName?: string, options?: string) {
  const page = pageBaseMarkup();
  const main = createElement('main', ['main-section']);
  const content = createElement('div', ['content-wrapper']);
  const head = headerRender(true);
  const aside = sidebarRender(head, activeTabName);
  main.append(aside, content);
  page.append(head, main, footerRender());
  if (options) renderInner(options);
  else renderInner();
}
