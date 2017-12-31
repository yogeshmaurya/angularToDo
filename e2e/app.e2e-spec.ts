import { AngularToDoPage } from './app.po';

describe('angular-to-do App', () => {
  let page: AngularToDoPage;

  beforeEach(() => {
    page = new AngularToDoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
