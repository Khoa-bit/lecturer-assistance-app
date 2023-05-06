import { expect, test } from "@playwright/test";
import { existsSync } from "fs";
import sharp from "sharp";
import { getStatusFileName } from "../../src/components/documents/Status";

const expectedStatusPNGs = [
  "StatusClosed.png",
  "StatusDone.png",
  "StatusInprogress.png",
  "StatusReview.png",
  "StatusTodo.png",
];

test("Status Screenshots", async ({ page }) => {
  await page.goto(`/screenshots/Components`); // Replace with your URL

  const elementHandle = await page.locator("#main > p");

  for (const elementHandleElement of await elementHandle.elementHandles()) {
    const innerText = await elementHandleElement.innerText();
    const png = getStatusFileName(innerText);
    await expect(
      expectedStatusPNGs.some((value) => png === value)
    ).toBeTruthy();

    const pathTest = `test-results/screenshots/${png}`;
    const pathOut = `public/screenshots/${png}`;
    await elementHandleElement.screenshot({
      path: pathTest,
    });
    await sharp(pathTest).unflatten().toFile(pathOut);

    await expect(existsSync(pathOut)).toBeTruthy();
  }
});
