import { describe, expect, test } from "@jest/globals"
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

describe("hotfix 버전 체크", () => {
  test("1.0.1 버전은 hotfix 버전이다", () => {
    // given
    const version = new Version(1, 0, 1)

    // when
    const actual = version?.isHotfix()

    // then
    expect(actual).toBeTruthy
  })

  test("1.0.0 버전은 hotfix 버전이 아니다", () => {
    // given
    const version = new Version(1, 0, 0)

    // when
    const actual = version?.isHotfix()

    // then
    expect(actual).toBeFalsy
  })
})
