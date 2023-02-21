import { expect, test } from "@jest/globals"
import { Version } from "../main/version"

test("1.101.102 문자열로 Version을 만들 수 있다", () => {
  // when
  const actual = Version.from("1.101.102")

  // then
  const expected = new Version(1, 101, 102);
  expect(actual).toEqual(expected)
})

test("v1.101.102 문자열로 Version을 만들 수 있다", () => {
  // when
  const actual = Version.from("v1.101.102")

  // then
  const expected = new Version(1, 101, 102);
  expect(actual).toEqual(expected)
})
