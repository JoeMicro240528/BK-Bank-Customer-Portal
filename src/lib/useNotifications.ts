"use client";

import { useCallback, useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { mapBankState } from "@/lib/requests";

type Language = "en" | "ar";

type Kind = "message" | "decision";

export type Notification = {
  kind: Kind;
  /** Stable across reloads: the message id the backend assigned. */
  id: string;
  /** Shown to the user. */
  requestReference: string;
  /** What the details route is keyed on -- external_ref, not the reference. */
  requestId: string;
  body: string;
  author: string;
  /** Set on a decision, so the UI can colour it. */
  rejected?: boolean;
  date: string;
  read: boolean;
};

const READ_KEY = "notifications_read";

/** Read state lives only in this browser -- the API offers no place to store it. */
function loadRead(): Set<string> {
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveRead(ids: Set<string>) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    // A browser refusing storage should not break the page.
  }
}

/**
 * The user's notifications, built from the chatter on each of their requests.
 * There is no feed endpoint, so this fans out over the request list; a request
 * whose messages cannot be read is skipped rather than failing the whole page.
 */
export function useNotifications(ownerId: string | undefined, language: Language) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ownerId) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const requests = await frontendApi.listRequests({ language, ownerId });
        const read = loadRead();

        const decisionText = {
          ar: {
            rejected: (bank: string) => `${bank} رفض طلبك.`,
            approved: (bank: string) => `${bank} اعتمد طلبك.`,
          },
          en: {
            rejected: (bank: string) => `${bank} rejected your request.`,
            approved: (bank: string) => `${bank} approved your request.`,
          },
        }[language];

        const perRequest = await Promise.all(
          requests.map(async (request) => {
            const requestId = request.external_ref || request.reference;

            // A bank's decision is an event the user needs to hear about, and
            // it arrives on the request itself -- not as chatter. Without this
            // a rejection never reached the notifications page at all.
            const decisions: Notification[] = (request.feedback || [])
              .filter((entry) => entry.processed_at)
              .map((entry): Notification | null => {
                const status = mapBankState(entry.state);
                if (status !== "rejected" && status !== "approved") return null;

                const id = `decision-${request.reference}-${entry.bank_id}-${entry.state}`;
                return {
                  kind: "decision" as const,
                  id,
                  requestReference: request.reference,
                  requestId,
                  body: decisionText[status](entry.bank_name),
                  author: entry.bank_name,
                  rejected: status === "rejected",
                  date: entry.processed_at as string,
                  read: read.has(id),
                };
              })
              .filter((item): item is Notification => item !== null);

            try {
              const messages = await frontendApi.listMessages(request.reference, {
                language,
                ownerId,
              });
              return [
                ...decisions,
                ...messages.map((message) => ({
                  kind: "message" as const,
                  id: String(message.id),
                  requestReference: request.reference,
                  requestId,
                  body: message.body,
                  author: message.author?.name || "",
                  date: message.date,
                  read: read.has(String(message.id)),
                })),
              ];
            } catch {
              // Chatter may be unreadable; the decisions still stand on their own.
              return decisions;
            }
          }),
        );

        if (cancelled) return;
        setItems(
          perRequest.flat().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
        );
      } catch (caught) {
        if (!cancelled) {
          setError(errorMessage(caught));
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ownerId, language]);

  const markRead = useCallback((id: string) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, read: true } : item)));
    const read = loadRead();
    read.add(id);
    saveRead(read);
  }, []);

  const markAllRead = useCallback(() => {
    setItems((previous) => {
      saveRead(new Set(previous.map((item) => item.id)));
      return previous.map((item) => ({ ...item, read: true }));
    });
  }, []);

  return { items, loading, error, markRead, markAllRead };
}
