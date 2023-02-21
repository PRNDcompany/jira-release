export class Version {
  major: number
  minor: number
  patch: number

  constructor(major: number, minor: number, patch: number) {
    this.major = major
    this.minor = minor
    this.patch = patch
  }

  public static from(text: string): Version | null {
    const versionRegExp = new RegExp(".*(\\d{1,5}\\.\\d{1,5}\\.\\d{1,5})", "g")
    const regexArray = versionRegExp.exec(text)
    if (regexArray == null) return null

    const rawVersion = regexArray[1]
    const [major, minor, patch] = rawVersion.split(".")
      .map(string => parseInt(string))
    return new Version(major, minor, patch)
  }
}
