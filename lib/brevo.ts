// Brevo (formerly Sendinblue) marketing API.
// Used for the newsletter list only — transactional order/appointment emails
// stay on Resend. Keeping the two separate means a marketing sending issue can
// never stop a customer receiving their order confirmation.

const BREVO_API_BASE = "https://api.brevo.com/v3";

export interface BrevoSyncResult {
  ok: boolean;
  contactId?: number;
  error?: string;
}

function getConfig(): { apiKey: string; listId: number } | null {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isFinite(listId) || listId <= 0) {
    return null;
  }

  return { apiKey, listId };
}

export function isBrevoConfigured(): boolean {
  return getConfig() !== null;
}

// Adds the contact to the newsletter list, or updates them if Brevo already
// knows the address. Never throws — the caller decides what a failure means.
export async function addContactToBrevo(
  email: string,
  fullName?: string
): Promise<BrevoSyncResult> {
  const config = getConfig();
  if (!config) {
    return { ok: false, error: "Brevo is not configured" };
  }

  try {
    const response = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "api-key": config.apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [config.listId],
        // Lets a repeat signup re-add someone to the list instead of erroring
        updateEnabled: true,
        attributes: fullName ? { FIRSTNAME: fullName } : undefined,
      }),
      // Never let a slow Brevo response hold up the visitor's signup
      signal: AbortSignal.timeout(8000),
    });

    // 201 = created (body has the id), 204 = existing contact updated (no body)
    if (response.status === 204) {
      return { ok: true };
    }

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return { ok: true, contactId: data?.id };
    }

    const detail = await response.text().catch(() => "");
    return {
      ok: false,
      error: `Brevo responded ${response.status}: ${detail.slice(0, 200)}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: `Brevo request failed: ${message}` };
  }
}

// Removes someone from the marketing list when they unsubscribe on our side,
// so the two systems cannot drift apart.
export async function removeContactFromBrevoList(
  email: string
): Promise<BrevoSyncResult> {
  const config = getConfig();
  if (!config) {
    return { ok: false, error: "Brevo is not configured" };
  }

  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/lists/${config.listId}/contacts/remove`,
      {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ emails: [email] }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (response.ok || response.status === 204) {
      return { ok: true };
    }

    const detail = await response.text().catch(() => "");
    return {
      ok: false,
      error: `Brevo responded ${response.status}: ${detail.slice(0, 200)}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: `Brevo request failed: ${message}` };
  }
}
