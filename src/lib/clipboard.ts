/** Copy only from an explicit visitor action, with a fallback for restricted browsers. */
export async function copyText(text: string): Promise<void> {
  const previous = document.activeElement as HTMLElement | null;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  (document.querySelector('[role="dialog"]') ?? document.body).appendChild(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
  } finally {
    field.remove();
    previous?.focus({ preventScroll: true });
  }
  if (copied) return;
  if (!navigator.clipboard) throw new Error("Clipboard unavailable");
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Clipboard permission unavailable")), 2000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
