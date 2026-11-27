import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { WarhammerScrollPane } from '@/components/global/WarhammerScrollPane';
import './WarhammerFormControls.scss';

export interface WarhammerOption {
  value: string;
  label: string;
}

export const WarhammerFilterPanel = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => (
  <section className={`warhammer-filter-panel ${className}`.trim()}>
    {children}
  </section>
);

export const WarhammerSelect = ({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly WarhammerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}): ReactElement => {
  const generatedId = useId();
  const listboxId = `${id}-${generatedId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef('');
  const typeaheadTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(
    () => () => {
      if (typeaheadTimeout.current) clearTimeout(typeaheadTimeout.current);
    },
    [],
  );

  const choose = (option: WarhammerOption): void => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (disabled) return;
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setActiveIndex(selectedIndex);
        setOpen(true);
      } else if (options.length > 0) {
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(
          (current) => (current + direction + options.length) % options.length,
        );
      }
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : Math.max(0, options.length - 1));
      setOpen(true);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open && options[activeIndex]) choose(options[activeIndex]);
      else {
        setActiveIndex(selectedIndex);
        setOpen(true);
      }
      return;
    }
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      typeahead.current += event.key.toLocaleLowerCase();
      const match = options.findIndex((option) =>
        option.label.toLocaleLowerCase().startsWith(typeahead.current),
      );
      if (match >= 0) {
        setActiveIndex(match);
        setOpen(true);
      }
      if (typeaheadTimeout.current) clearTimeout(typeaheadTimeout.current);
      typeaheadTimeout.current = setTimeout(() => {
        typeahead.current = '';
      }, 700);
    }
  };

  return (
    <div className="warhammer-form-field">
      <label className="warhammer-form-label" id={`${id}-label`}>
        {label}
      </label>
      <div className="warhammer-select" ref={rootRef}>
        <button
          className="warhammer-select-trigger"
          type="button"
          id={id}
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? `${listboxId}-option-${activeIndex}` : undefined}
          disabled={disabled}
          onClick={() => {
            setActiveIndex(selectedIndex);
            setOpen((current) => !current);
          }}
          onKeyDown={handleKeyDown}
        >
          <span className="warhammer-select-value">{selected?.label ?? ''}</span>
          <span className="warhammer-select-arrow" aria-hidden="true" />
        </button>
        {open && (
          <div className="warhammer-select-menu-frame">
            <WarhammerScrollPane
              className="warhammer-select-menu-scroll"
              viewportClassName="warhammer-select-menu-viewport"
              ariaLabel={`${label} options`}
              scrollUpLabel={`Scroll ${label} options up`}
              scrollDownLabel={`Scroll ${label} options down`}
              viewportTabIndex={-1}
            >
              <div
                className="warhammer-select-menu"
                id={listboxId}
                role="listbox"
                aria-labelledby={`${id}-label`}
              >
                {options.map((option, index) => (
                  <div
                    className={`warhammer-select-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
                    id={`${listboxId}-option-${index}`}
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    onPointerMove={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </WarhammerScrollPane>
          </div>
        )}
      </div>
    </div>
  );
};

export const WarhammerDateInput = ({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}): ReactElement => (
  <div className="warhammer-form-field">
    <label className="warhammer-form-label" htmlFor={id}>
      {label}
    </label>
    <input
      className="warhammer-text-entry warhammer-date-input"
      id={id}
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.currentTarget.value)
      }
    />
  </div>
);

export const WarhammerTextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search';
}): ReactElement => (
  <div className="warhammer-form-field">
    <label className="warhammer-form-label" htmlFor={id}>
      {label}
    </label>
    <input
      className="warhammer-text-entry"
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.currentTarget.value)
      }
    />
  </div>
);

export const WarhammerCheckbox = ({
  id,
  checked,
  onChange,
  children,
  disabled = false,
  title,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  title?: string;
}): ReactElement => (
  <label
    className={`warhammer-checkbox${disabled ? ' is-disabled' : ''}`}
    htmlFor={id}
    title={title}
  >
    <input
      className="warhammer-checkbox-input"
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
    <span className="warhammer-checkbox-box" aria-hidden="true" />
    <span>{children}</span>
  </label>
);

export const WarhammerRadio = ({
  id,
  name,
  checked,
  onChange,
  children,
  disabled = false,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  disabled?: boolean;
}): ReactElement => (
  <label
    className={`warhammer-radio${disabled ? ' is-disabled' : ''}`}
    htmlFor={id}
  >
    <input
      className="warhammer-radio-input"
      id={id}
      name={name}
      type="radio"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    <span>{children}</span>
  </label>
);
