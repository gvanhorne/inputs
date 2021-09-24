import {html} from "htl";
import {parse as isoparse} from "isoformat";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

export function date({
  label,
  min,
  max,
  required,
  readonly,
  disabled,
  width,
  value,
  ...options
} = {}) {
  const input = html`<input type=date name=date readonly=${readonly} disabled=${disabled} required=${required} min=${format(min)} max=${format(max)}>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>
  </form>`;
  return createText(form, input, {
    ...options,
    value: coerce(value),
    get: (input) => input.valueAsDate,
    set: (input, value) => input.value = format(value),
    same: (input, value) => +input.valueAsDate === +value
  });
}

function coerce(value) {
  return value instanceof Date && !isNaN(value) ? value
    : typeof value === "string" ? isoparse(value, null)
    : value == null || isNaN(value = +value) ? null
    : new Date(+value);
}

function format(value) {
  return (value = coerce(value))
    ? value.toISOString().slice(0, 10)
    : value;
}
