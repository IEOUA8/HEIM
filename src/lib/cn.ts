import clsx, { type ClassValue } from "clsx";

/** Une clases condicionalmente. Wrapper delgado sobre clsx. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
