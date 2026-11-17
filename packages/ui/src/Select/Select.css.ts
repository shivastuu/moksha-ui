// A native select restyled as a field: the browser still draws the list (the OS picker on phones)
export const selectCss = `
.ds-select{position:relative}
.ds-select__input{height:100%;padding-right:calc(var(--ds-space-xl) + var(--ds-space-xs));-webkit-appearance:none;appearance:none;cursor:pointer}
.ds-select__input[data-empty]{color:var(--ds-color-text-muted)}
.ds-select__input option{color:var(--ds-color-text)}
.ds-select__chevron{position:absolute;right:var(--ds-field-md-padding-x);font-size:16px;color:var(--ds-color-text-muted);pointer-events:none;transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-select:focus-within .ds-select__chevron{color:var(--ds-color-text)}
.ds-select__input:disabled{cursor:not-allowed}
`;
