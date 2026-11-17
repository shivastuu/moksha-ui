'use client';

import { useRef } from 'react';
import { CheckIcon } from '../Icon/CheckIcon.web';
import { CopyIcon } from '../Icon/CopyIcon.web';
import { useCopy, type CopyFieldProps } from './CopyField.shared';

const systemClipboard = (value: string) => navigator.clipboard.writeText(value);

/** A value with a copy button, like a UPI ID or account number. The icon springs into a check once copied */
export function CopyField({ label, value, onCopy = systemClipboard, testID }: CopyFieldProps) {
  const text = useRef<HTMLSpanElement>(null);
  const { copied, run } = useCopy(value, onCopy);

  const copy = async () => {
    if (!(await run()) && text.current) {
      // No clipboard access (permission, or a page not on https): select the value so Ctrl/Cmd+C works
      window.getSelection()?.selectAllChildren(text.current);
    }
  };

  return (
    <div className="ds-copy" data-testid={testID}>
      <span className="ds-copy__text">
        <span className="ds-copy__label">{label}</span>
        <span ref={text} className="ds-copy__value">
          {value}
        </span>
      </span>
      <button type="button" className="ds-copy__button ds-press ds-press--object" aria-label={`Copy ${label}`} data-copied={copied || undefined} onClick={copy}>
        <CopyIcon className="ds-copy__icon ds-copy__sheets" />
        <CheckIcon className="ds-copy__icon ds-copy__check" />
      </button>
      <span className="ds-visually-hidden" role="status">
        {copied ? `${label} copied` : ''}
      </span>
    </div>
  );
}
