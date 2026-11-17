'use client';

import { useId, useRef, useState, type DragEvent } from 'react';
import { useControllableState } from '../utils/useControllableState';
import { addedMessage, addFiles, fileBadge, formatBytes, type FileUploadProps, type PickedFile } from './FileUpload.shared';

const UploadIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 15V4m0 0-4 4m4-4 4 4M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
);

const picked = (list: FileList | null): PickedFile[] => Array.from(list ?? [], (file) => ({ name: file.name, size: file.size, type: file.type, file }));

/** Drop files or browse for them. Files are checked for type and size, and each refusal says why */
export function FileUpload({ label, accept, maxSize, multiple, value, defaultValue = [], onValueChange, hint, disabled, testID }: FileUploadProps) {
  const [files, setFiles] = useControllableState(value, defaultValue, onValueChange);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const browse = useRef<HTMLButtonElement>(null);
  const id = useId();

  const add = (incoming: PickedFile[]) => {
    if (disabled || !incoming.length) {
      return;
    }
    const result = addFiles(files, incoming, { accept, maxSize, multiple });
    setErrors(result.errors);
    const added = incoming.length - result.errors.length;
    setStatus(added > 0 ? addedMessage(added) : '');
    if (result.files !== files) {
      setFiles(result.files);
    }
  };

  const remove = (file: PickedFile) => {
    setFiles(files.filter((kept) => kept !== file));
    setStatus(`${file.name} removed`);
    // The row and its button are gone, so focus goes back to browse
    browse.current?.focus();
  };

  const over = (event: DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  return (
    <div className="ds-upload" data-testid={testID}>
      <span id={`${id}-label`} className="ds-upload__label">
        {label}
      </span>
      <div
        className="ds-upload__zone"
        role="group"
        aria-labelledby={`${id}-label`}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onDragEnter={over}
        onDragOver={over}
        onDragLeave={(event) => !event.currentTarget.contains(event.relatedTarget as Node) && setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          add(picked(event.dataTransfer.files));
        }}
      >
        <span className="ds-upload__icon" aria-hidden="true">
          <UploadIcon />
        </span>
        <p className="ds-upload__prompt">
          Drop {multiple ? 'files' : 'a file'} here or{' '}
          <button ref={browse} type="button" className="ds-upload__browse" disabled={disabled} aria-describedby={hint ? `${id}-hint` : undefined} onClick={() => input.current?.click()}>
            browse
          </button>
        </p>
        {hint && (
          <p id={`${id}-hint`} className="ds-upload__hint">
            {hint}
          </p>
        )}
        <input
          ref={input}
          type="file"
          className="ds-visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            add(picked(event.target.files));
            // Lets the same file be picked again after it's removed
            event.target.value = '';
          }}
        />
      </div>
      {errors.length > 0 && (
        <ul className="ds-upload__errors" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul className="ds-upload__files" aria-label={`${label}, chosen files`}>
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`} className="ds-upload__file">
              <span className="ds-upload__badge" aria-hidden="true">
                {fileBadge(file.name)}
              </span>
              <span className="ds-upload__meta">
                <span className="ds-upload__name">{file.name}</span>
                <span className="ds-upload__size">{formatBytes(file.size)}</span>
              </span>
              <button type="button" className="ds-upload__remove" aria-label={`Remove ${file.name}`} onClick={() => remove(file)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <span className="ds-visually-hidden" role="status">
        {status}
      </span>
    </div>
  );
}
