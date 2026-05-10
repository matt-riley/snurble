import type { HTMLAttributes } from "astro/types";

import { toSpaceSeparatedIds } from "./a11y";

export interface ToggleControlProps extends Omit<
  HTMLAttributes<"input">,
  "class" | "id" | "type" | "checked"
> {
  id: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  required?: boolean;
  describedBy?: string | readonly string[];
  class?: string;
}

export const getToggleControlProps = (props: ToggleControlProps) => {
  const {
    id,
    label,
    disabled = false,
    checked = false,
    required = false,
    describedBy,
    class: className,
    ...rest
  } = props;

  return {
    ariaDescribedBy: toSpaceSeparatedIds(describedBy),
    checked,
    className,
    disabled,
    id,
    label,
    required,
    rest,
  };
};
