import { FlagPipe } from './shared/pipes/flag-pipe';

describe('FlagPipe', () => {
  it('create an instance', () => {
    const pipe = new FlagPipe();
    expect(pipe).toBeTruthy();
  });
});
