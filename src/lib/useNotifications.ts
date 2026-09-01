"use client";

import { useCallback, useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";

type Language = "en" | "ar";

export type Notification = {
  /** Stable across reloads: the message id the backend assigned. */
  id: string;
  /** Shown to the user. */
  requestReference: string;
  /** What the details route is keyed on -- external_ref, not the reference. */
  requestId: string;
  body: string;
  author: string;
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

        const perRequest = await Promise.all(
          requests.map(async (request) => {
            try {
              const messages = await frontendApi.listMessages(request.reference, {
                language,
                ownerId,
              });
              return messages.map((message) => ({
                id: String(message.id),
                requestReference: request.reference,
                requestId: request.external_ref || request.reference,
                body: message.body,
                author: message.author?.name || "",
                date: message.date,
                read: read.has(String(message.id)),
              }));
            } catch {
              return [];
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
