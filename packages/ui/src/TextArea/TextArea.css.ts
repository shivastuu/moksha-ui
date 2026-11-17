// The box is a column: the text, then the counter row. It grows with its content where field-sizing works
export const textAreaCss = `
.ds-field__control.ds-textarea{flex-direction:column;align-items:stretch;gap:var(--ds-space-xs);padding-top:var(--ds-space-md);padding-bottom:var(--ds-space-md)}
.ds-textarea__input{flex:none;min-height:calc(var(--ds-textarea-rows) * 1lh);max-height:calc(var(--ds-textarea-max-rows) * 1lh);line-height:var(--ds-line-height-md);resize:none;field-sizing:content;overflow-y:auto}
.ds-textarea__count{align-self:flex-end;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:var(--ds-color-text-muted);font-variant-numeric:tabular-nums;transition:color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-textarea__count[data-full]{color:var(--ds-text-tone-danger)}
`;
