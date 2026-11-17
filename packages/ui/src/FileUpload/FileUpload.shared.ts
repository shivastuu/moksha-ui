export interface PickedFile {
  name: string;
  /** In bytes */
  size: number;
  /** MIME type, like "application/pdf"; may be empty */
  type: string;
  /** Web: the File, ready to upload */
  file?: File;
  /** Native: where the picker put it */
  uri?: string;
}

export interface FileUploadProps {
  /** What to upload, like "PAN card" */
  label: string;
  /** Allowed files, like ".pdf,image/*" (extensions, exact types or type/*) */
  accept?: string;
  /** Largest allowed file, in bytes */
  maxSize?: number;
  /** Allows more than one file; otherwise a new file replaces the old one */
  multiple?: boolean;
  value?: PickedFile[];
  defaultValue?: PickedFile[];
  onValueChange?: (files: PickedFile[]) => void;
  /** Under the drop zone, like "PDF or JPG, up to 5 MB" */
  hint?: string;
  /** Native: opens your picker (like expo-document-picker) and resolves to the chosen files. Without it the zone is disabled */
  onPick?: () => Promise<PickedFile[]>;
  disabled?: boolean;
  testID?: string;
}

/** 1536 → "1.5 KB" (1024-based, one decimal, no trailing .0) */
export function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit ? Number(value.toFixed(1)) : value} ${units[unit]}`;
}

/** Whether a file fits an accept list: ".pdf" matches the name, "image/*" the type family, "application/pdf" the exact type */
export function matchesAccept(file: Pick<PickedFile, 'name' | 'type'>, accept?: string) {
  if (!accept) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) => (rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

/** The files after adding `incoming`, and a message for each one turned away */
export function addFiles(current: PickedFile[], incoming: PickedFile[], { accept, maxSize, multiple }: Pick<FileUploadProps, 'accept' | 'maxSize' | 'multiple'>) {
  const errors: string[] = [];
  const accepted = incoming.filter((file) => {
    if (!matchesAccept(file, accept)) {
      errors.push(`${file.name} isn't a file type we accept`);
      return false;
    }
    if (maxSize !== undefined && file.size > maxSize) {
      errors.push(`${file.name} is over ${formatBytes(maxSize)}`);
      return false;
    }
    return true;
  });
  if (!multiple) {
    return { files: accepted.length ? [accepted[0]!] : current, errors };
  }
  // The same name and size counts as the same file
  const fresh = accepted.filter((file) => !current.some((kept) => kept.name === file.name && kept.size === file.size));
  return { files: [...current, ...fresh], errors };
}

/** "PDF" from "aadhaar.pdf", for the file tile */
export const fileBadge = (name: string) => (name.includes('.') ? name.split('.').pop()!.toUpperCase().slice(0, 4) : 'FILE');

/** What screen readers hear after files are added */
export const addedMessage = (count: number) => (count === 1 ? '1 file added' : `${count} files added`);
