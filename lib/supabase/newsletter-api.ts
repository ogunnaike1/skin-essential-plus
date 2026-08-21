import { supabaseAdmin } from './admin-client';

// Server-side only. Uses the service role key because the subscribers table has
// row level security on with no public policies — the browser cannot read it.

export type SubscriberStatus =
  | 'subscribed'
  | 'unsubscribed'
  | 'bounced'
  | 'complained';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  full_name: string | null;
  status: SubscriberStatus;
  source: string;
  consent_ip: string | null;
  consent_at: string;
  unsubscribe_token: string;
  brevo_contact_id: number | null;
  synced_to_brevo: boolean;
  brevo_sync_error: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscribeInput {
  email: string;
  fullName?: string;
  source?: string;
  consentIp?: string;
}

export interface SubscribeResult {
  subscriber: NewsletterSubscriber;
  /** False when this address was already on the list and still subscribed. */
  isNew: boolean;
}

// Adds a subscriber, or reactivates them if they had previously unsubscribed.
// Safe to call repeatedly with the same address.
export async function subscribeToNewsletter(
  input: SubscribeInput
): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase();

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    // Already active — nothing to do, and importantly no second welcome email.
    if (existing.status === 'subscribed') {
      return { subscriber: existing as NewsletterSubscriber, isNew: false };
    }

    // Previously unsubscribed or bounced, and now opting back in themselves.
    const { data: reactivated, error: updateError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({
        status: 'subscribed',
        unsubscribed_at: null,
        consent_ip: input.consentIp ?? existing.consent_ip,
        consent_at: new Date().toISOString(),
        source: input.source ?? existing.source,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return { subscriber: reactivated as NewsletterSubscriber, isNew: true };
  }

  const { data: created, error: insertError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .insert({
      email,
      full_name: input.fullName ?? null,
      source: input.source ?? 'website',
      consent_ip: input.consentIp ?? null,
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return { subscriber: created as NewsletterSubscriber, isNew: true };
}

// Records the outcome of pushing a subscriber to Brevo so failed syncs stay
// visible and can be retried, rather than vanishing silently.
export async function recordBrevoSync(
  subscriberId: string,
  result: { ok: boolean; contactId?: number; error?: string }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({
      synced_to_brevo: result.ok,
      brevo_contact_id: result.contactId ?? null,
      brevo_sync_error: result.ok ? null : (result.error ?? 'Unknown error'),
    })
    .eq('id', subscriberId);

  if (error) {
    console.error('Failed to record Brevo sync state:', error);
  }
}

// Looks a subscriber up by the secret token embedded in unsubscribe links.
export async function getSubscriberByToken(
  token: string
): Promise<NewsletterSubscriber | null> {
  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('*')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error) throw error;
  return data as NewsletterSubscriber | null;
}

export async function unsubscribeByToken(
  token: string
): Promise<NewsletterSubscriber | null> {
  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('unsubscribe_token', token)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as NewsletterSubscriber | null;
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as NewsletterSubscriber[];
}

export async function getSubscriberStats(): Promise<{
  total: number;
  subscribed: number;
  unsubscribed: number;
  unsynced: number;
}> {
  const subscribers = await getSubscribers();

  return {
    total: subscribers.length,
    subscribed: subscribers.filter((s) => s.status === 'subscribed').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
    unsynced: subscribers.filter(
      (s) => s.status === 'subscribed' && !s.synced_to_brevo
    ).length,
  };
}
