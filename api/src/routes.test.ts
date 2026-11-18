import { describe, expect, it } from "vitest";
import { router } from "./routes.ts";

describe("router", () => {
  it("répond 200 sur les deux routes de santé", () => {
    expect(router("GET", "/health").statut).toBe(200);
    expect(router("GET", "/sante?x=1").statut).toBe(200);
  });

  it("répond 404 sur une route inconnue ou une méthode non prévue", () => {
    expect(router("GET", "/api/v1/inconnue").statut).toBe(404);
    expect(router("POST", "/health").statut).toBe(404);
  });

  it("renvoie la liste des demandes sur GET /api/v1/demandes", () => {
    const reponse = router("GET", "/api/v1/demandes");
    expect(reponse.statut).toBe(200);
    const corps = reponse.corps as { demandes: unknown[] };
    expect(Array.isArray(corps.demandes)).toBe(true);
    expect(corps.demandes.length).toBeGreaterThan(0);
  });

  it("crée une demande de collectivité avec un devis déjà « sans objet »", () => {
    const reponse = router("POST", "/api/v1/demandes", {
      organisme: "Mairie de Vincennes",
      typeOrganisme: "collectivite",
      contact: "Isabelle Moreau",
    });
    expect(reponse.statut).toBe(201);
    const corps = reponse.corps as { demande: { statutDevis: string; etape: string } };
    expect(corps.demande.statutDevis).toBe("sans_objet");
    expect(corps.demande.etape).toBe("Nouvelle demande");
  });

  it("refuse de créer une demande sans organisme, type ou contact", () => {
    const avant = (router("GET", "/api/v1/demandes").corps as { demandes: unknown[] }).demandes.length;
    const reponse = router("POST", "/api/v1/demandes", { organisme: "", typeOrganisme: "entreprise" });
    expect(reponse.statut).toBe(400);
    const apres = (router("GET", "/api/v1/demandes").corps as { demandes: unknown[] }).demandes.length;
    expect(apres).toBe(avant);
  });
});
