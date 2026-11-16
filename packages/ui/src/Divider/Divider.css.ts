const line = 'background:var(--ds-color-border)';

export const dividerCss = `
.ds-divider{flex-shrink:0;margin:0;border:0;align-self:stretch;height:1px;${line}}
.ds-divider--vertical{width:1px;height:auto;min-height:1em}
.ds-divider--labelled{display:flex;align-items:center;gap:var(--ds-space-md);height:auto;background:none;color:var(--ds-color-text-muted);font-family:var(--ds-font-sans);font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs)}
.ds-divider--labelled::before,.ds-divider--labelled::after{content:'';flex:1;height:1px;${line}}
`;
