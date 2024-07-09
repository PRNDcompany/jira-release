# Jira Release action
This action release version & create new version in Jira

## Inputs
- `domain`:  domain name. ex) `https://your-domain.atlassian.net`.
- `project`:  project id. 
- `version`:  version name. ex) `Customer 1.1.0`
- `auth-token`:  auth token key.(Not Api key) 

### Auth Token
https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/

1. Generate an API token for Jira using your [Atlassian Account](https://id.atlassian.com/manage/api-tokens).
2. Build a string of the form `useremail:api_token`. (ted@prnd.co.kr:xxxxxxx) 
3. BASE64 encode the string.
- Linux/Unix/MacOS:
```
echo -n user@example.com:api_token_string | base64
```
- Windows 7 and later, using Microsoft Powershell:
```
$Text = ‘user@example.com:api_token_string’
$Bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
$EncodedText = [Convert]::ToBase64String($Bytes)
$EncodedText
```


## Outputs
- `new-version`: new version name. 


## Example usage
```yaml
name: Jira Release
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Extract version name
      run: echo "version=$(echo '${{ github.event.head_commit.message }}' | egrep -o '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')" >> $GITHUB_OUTPUT
      id: extract_version_name           
    - name: Jira Release
      id: release
      uses: PRNDcompany/jira-release@v1.2
      with:
        domain: 'your-domain'
        project: 'HDA'
        version: Customer ${{ steps.extract_version_name.outputs.version }}
        auth-token: 'xxxxxxxx'
    - name: Print New Version
      run: |
        echo ${{ steps.release.outputs.new-version }}
```
