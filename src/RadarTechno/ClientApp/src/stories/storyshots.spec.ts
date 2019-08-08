import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

jest.mock('../History/HistoryModal');

initStoryshots({
  storyKindRegex:/^((?!.*?Menu).)*$/,
  integrityOptions: { cwd: __dirname },
  test: multiSnapshotWithOptions(),
});
