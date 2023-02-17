import { expect, test } from "@jest/globals";
import { sample } from "../main/sample";

test("타입스크립트 테스트", () => {
  const actual = sample("foo", "bar")
  expect(actual).toBe("foo bar")
})
