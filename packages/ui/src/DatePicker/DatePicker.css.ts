const day = 40;

export const datePickerCss = `
.ds-date__button{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-sm);height:100%;text-align:start;cursor:pointer;font-variant-numeric:tabular-nums}
.ds-date__button svg{flex-shrink:0;font-size:18px;color:var(--ds-color-text-muted)}
.ds-date__button[data-empty]{color:var(--ds-color-text-muted)}
.ds-date__button:disabled{cursor:not-allowed}
.ds-calendar{display:grid;gap:var(--ds-space-sm);margin:calc(var(--ds-space-xs) * -1)}
.ds-calendar__header{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-sm)}
.ds-calendar__title{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-semibold);color:var(--ds-color-text)}
.ds-calendar__nav{display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text);font-size:16px;cursor:pointer}
.ds-calendar__nav:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-calendar__nav:focus-visible,.ds-calendar__day:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-calendar__grid{border-collapse:collapse;overflow:hidden}
.ds-calendar__grid td,.ds-calendar__grid th{padding:1px;text-align:center}
.ds-calendar__weekday{height:28px;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text-muted)}
.ds-calendar__body[data-direction=next]{animation:ds-calendar-next var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-calendar__body[data-direction=previous]{animation:ds-calendar-previous var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
@keyframes ds-calendar-next{from{opacity:0;transform:translateX(24px)}}
@keyframes ds-calendar-previous{from{opacity:0;transform:translateX(-24px)}}
.ds-calendar__day{position:relative;display:grid;place-items:center;width:${day}px;height:${day}px;padding:0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text);font:inherit;font-size:var(--ds-font-size-sm);font-variant-numeric:tabular-nums;cursor:pointer;isolation:isolate}
.ds-calendar__day[data-outside]{color:var(--ds-color-text-muted)}
.ds-calendar__day[aria-current=date]{color:var(--ds-text-tone-primary);font-weight:var(--ds-font-weight-semibold)}
.ds-calendar__day[aria-current=date]::after{content:'';position:absolute;bottom:5px;width:4px;height:4px;border-radius:var(--ds-radius-full);background:currentColor}
.ds-calendar__day[data-selected]{background:var(--ds-button-primary-fill);box-shadow:var(--ds-button-primary-shadow);color:var(--ds-color-text-on-primary);font-weight:var(--ds-font-weight-semibold);animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-calendar__day[aria-disabled]{opacity:var(--ds-opacity-disabled);cursor:not-allowed;text-decoration:line-through}
@media (prefers-reduced-motion:reduce){.ds-calendar__body{animation:none!important}.ds-calendar__day[data-selected]{animation:none}}
`;
