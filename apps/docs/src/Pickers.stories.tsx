import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, FileUpload } from '@moksha-ui/core';

const meta = { title: 'Components/Pickers' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 360, minHeight: 520 }}>
      <DatePicker label="Transfer date" today="2026-11-17" min="2026-11-17" max="2027-02-28" helperText="Scheduled transfers go out at 9 am" />
      <DatePicker label="Date of birth" defaultValue="1998-08-21" max="2008-11-17" today="2026-11-17" weekStartsOn={1} />
    </div>
  ),
};

export const Documents: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
      <FileUpload label="PAN card" accept=".pdf,image/*" maxSize={5 * 1024 * 1024} hint="PDF or a photo, up to 5 MB" />
      <FileUpload label="Bank statements" multiple accept=".pdf" maxSize={10 * 1024 * 1024} hint="PDFs, up to 10 MB each" />
    </div>
  ),
};
