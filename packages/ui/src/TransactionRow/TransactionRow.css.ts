export const transactionCss = `
.ds-transaction{display:grid;justify-items:end;gap:var(--ds-space-xs)}
.ds-transaction__amount{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium);font-variant-numeric:tabular-nums;color:var(--ds-color-text);white-space:nowrap}
.ds-transaction[data-direction=credit] .ds-transaction__amount{color:var(--ds-transaction-credit)}
.ds-transaction[data-status=failed] .ds-transaction__amount{color:var(--ds-color-text-muted);text-decoration:line-through}
`;
