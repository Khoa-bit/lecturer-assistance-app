// https://stackoverflow.com/questions/24004791/what-is-the-debounce-function-in-javascript
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function executedFunction(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = function (): void {
      timeout = undefined;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
