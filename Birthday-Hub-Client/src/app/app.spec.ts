import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { App } from './app';
import { he } from './i18n/he';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set the browser title from Hebrew translations', () => {
    TestBed.createComponent(App);
    expect(TestBed.inject(Title).getTitle()).toBe(he.header.title);
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Birthday-Hub-Client');
  });
});
