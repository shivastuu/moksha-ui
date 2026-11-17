import { sliderThumb } from './Slider.shared';

const track = `height:6px;border-radius:var(--ds-radius-full);background:linear-gradient(90deg,var(--ds-control-indicator) var(--ds-slider-fill),var(--ds-control-switch-off) var(--ds-slider-fill))`;
const thumb = `box-sizing:border-box;width:${sliderThumb}px;height:${sliderThumb}px;border:0;border-radius:var(--ds-radius-full);background:var(--ds-control-thumb);box-shadow:var(--ds-shadow-md),0 0 0 1px var(--ds-surface-edge);transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy),box-shadow var(--ds-spring-snappy-duration) var(--ds-spring-snappy)`;
const focus = `box-shadow:var(--ds-shadow-md),0 0 0 1px var(--ds-surface-edge),0 0 0 var(--ds-field-halo-width) var(--ds-field-halo)`;

// A native range input, restyled: Chrome/Safari and Firefox name the track and thumb differently
export const sliderCss = `
.ds-slider{display:grid;gap:var(--ds-space-sm);font-family:var(--ds-font-sans)}
.ds-slider__header{display:flex;align-items:baseline;justify-content:space-between;gap:var(--ds-space-md)}
.ds-slider__label{font-size:var(--ds-field-label-font-size);line-height:var(--ds-field-label-line-height);font-weight:var(--ds-field-label-font-weight);color:var(--ds-color-text)}
.ds-slider__value{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums;color:var(--ds-color-text)}
.ds-slider__input{width:100%;height:${sliderThumb + 4}px;margin:0;background:transparent;cursor:pointer;-webkit-appearance:none;appearance:none}
.ds-slider__input:focus{outline:none}
.ds-slider__input::-webkit-slider-runnable-track{${track}}
.ds-slider__input::-moz-range-track{${track}}
.ds-slider__input::-webkit-slider-thumb{${thumb};margin-top:${(6 - sliderThumb) / 2}px;-webkit-appearance:none;appearance:none}
.ds-slider__input::-moz-range-thumb{${thumb}}
.ds-slider__input:active::-webkit-slider-thumb{transform:scale(1.15)}
.ds-slider__input:active::-moz-range-thumb{transform:scale(1.15)}
.ds-slider__input:focus-visible::-webkit-slider-thumb{${focus}}
.ds-slider__input:focus-visible::-moz-range-thumb{${focus}}
.ds-slider__scale{display:flex;justify-content:space-between;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:var(--ds-color-text-muted);font-variant-numeric:tabular-nums}
.ds-slider--disabled{opacity:var(--ds-opacity-disabled)}
.ds-slider--disabled .ds-slider__input{cursor:not-allowed}
@media (prefers-reduced-motion:reduce){.ds-slider__input::-webkit-slider-thumb{transition:none}.ds-slider__input::-moz-range-thumb{transition:none}}
`;
