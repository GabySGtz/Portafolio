import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should create the app class', () => {
    const app = new App();

    expect(app).toBeTruthy();
  });

  it('should include Ana Gabriela portfolio data', () => {
    const app = new App() as unknown as {
      projects: Array<{ name: string }>;
      technologies: Array<{ category: string }>;
    };

    expect(app.projects.some((project) => project.name === 'TEC Performance')).toBe(true);
    expect(app.technologies.some((group) => group.category === 'Frontend')).toBe(true);
  });
});
