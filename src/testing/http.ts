import { vi } from "vitest";

/** A JSON `Response`, as returned by `fetch`. */
export const jsonResponse = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status });

/** A fake `fetch` that answers each call in turn: an Error is thrown, a Response is returned. */
export const fetchReplying = (...replies: (Response | Error)[]) => {
  const fetchFn = vi.fn();
  replies.forEach((reply) =>
    reply instanceof Error ? fetchFn.mockRejectedValueOnce(reply) : fetchFn.mockResolvedValueOnce(reply),
  );
  return fetchFn;
};
