import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je vois la liste des demandes de Sophie A.", async () => {
    await expect(page.getByText("Mes demandes")).toBeVisible();
    await expect(page.getByText("Groupe Renault Trucks")).toBeVisible();
    await expect(page.getByText("Mairie de Montreuil")).toBeVisible();
  });
});
