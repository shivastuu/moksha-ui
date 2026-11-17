// A label and value on one line, for receipts and details. In a ListGroup its divider starts under the label
export const detailRowCss = `
.ds-detail-row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-lg);padding:var(--ds-space-md) var(--ds-space-lg);font-family:var(--ds-font-sans);font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md)}
.ds-detail-row__label{flex-shrink:0;color:var(--ds-color-text-muted)}
.ds-detail-row__value{min-width:0;color:var(--ds-color-text);font-weight:var(--ds-font-weight-medium);font-variant-numeric:tabular-nums;text-align:end;overflow-wrap:anywhere}
.ds-list-group__item+.ds-list-group__item .ds-detail-row::before{content:'';position:absolute;top:0;right:0;left:var(--ds-space-lg);height:1px;background:var(--ds-surface-edge)}
`;
