import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Config = {
  style: 'audio-components';
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  installationType: 'cli' | 'manual';
};

const configAtom = atomWithStorage<Config>('config', {
  style: 'audio-components',
  packageManager: 'pnpm',
  installationType: 'cli',
});

export function useConfig() {
  return useAtom(configAtom);
}
