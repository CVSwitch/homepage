import { Switch } from '@headlessui/react';

interface Props {
  isActive: boolean;
  onToggle: () => void;
}

export function PracticeMode({ isActive, onToggle }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onChange={onToggle}
        className={`${
          isActive ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span
          className={`${
            isActive ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className="text-sm font-medium">Practice Mode</span>
    </div>
  );
} 