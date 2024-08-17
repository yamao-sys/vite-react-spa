import { describe, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  test('renders App component', () => {
    render(<App />);

    screen.getByText('Click on the Vite and React logos to learn more');
  });

  test('change count', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /count is 0/i }));
    screen.getByText('current count is 1');
  });
});
