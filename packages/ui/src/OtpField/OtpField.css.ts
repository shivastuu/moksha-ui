export const otpCss = `
.ds-otp{position:relative;display:inline-flex;gap:var(--ds-otp-gap)}
.ds-otp__cell{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:var(--ds-otp-cell-size);height:var(--ds-otp-cell-size);border:var(--ds-field-border-width) solid var(--ds-color-border);border-radius:var(--ds-otp-radius);background:var(--ds-color-background);color:var(--ds-color-text);font-family:var(--ds-font-sans);font-size:var(--ds-otp-font-size);font-weight:var(--ds-font-weight-semibold);transition:border-color var(--ds-duration-fast) var(--ds-easing-standard),box-shadow var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-otp__cell--active{border-color:var(--ds-color-primary);box-shadow:0 0 0 var(--ds-field-border-width) var(--ds-color-primary)}
.ds-field--invalid .ds-otp__cell{border-color:var(--ds-color-danger)}
.ds-field--invalid .ds-otp__cell--active{box-shadow:0 0 0 var(--ds-field-border-width) var(--ds-color-danger)}
.ds-field--disabled .ds-otp{opacity:var(--ds-opacity-disabled)}
.ds-otp__input{position:absolute;inset:0;width:100%;height:100%;margin:0;padding:0;border:0;opacity:0;background:transparent;color:transparent;caret-color:transparent;font-size:var(--ds-font-size-md);cursor:text}
.ds-otp__input:disabled{cursor:not-allowed}
.ds-otp__digit{animation:ds-pop var(--ds-duration-normal) var(--ds-easing-enter)}
.ds-otp--shake{animation:ds-shake var(--ds-duration-slow) var(--ds-easing-standard)}
@media (prefers-reduced-motion:reduce){.ds-otp__cell{transition:none}.ds-otp__digit{animation:none}.ds-otp--shake{--ds-motion-distance-sm:0px}}
`;
