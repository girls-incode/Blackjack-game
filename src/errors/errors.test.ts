import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppError,
  ConfigError,
  DeckError,
  EXIT_APP_ERROR,
  EXIT_UNEXPECTED_ERROR,
  GameError,
  handleError,
} from ".";

describe("handleError", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  afterEach(() => spy.mockClear());

  it.each([
    new ConfigError("bad config"),
    new DeckError("bad deck"),
    new GameError("bad game"),
  ])("reports expected errors briefly with exit code 1 (%s)", (err) => {
    expect(handleError(err)).toBe(EXIT_APP_ERROR);
    expect(spy).toHaveBeenCalledWith(`Error: ${err.message}`);
  });
  it("reports unexpected errors with their stack and exit code 2", () => {
    const err = new TypeError("bug");
    expect(handleError(err)).toBe(EXIT_UNEXPECTED_ERROR);
    expect(spy).toHaveBeenCalledWith("Unexpected error:", err);
  });
  it("names errors after their class", () => {
    expect(new DeckError("x").name).toBe("DeckError");
    expect(new DeckError("x")).toBeInstanceOf(AppError);
  });
});
