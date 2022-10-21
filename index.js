const core = require('@actions/core');
const rp = require('request-promise');

let domain, project, version, token
(async () => {
    try {

        domain = core.getInput('domain');
        project = core.getInput('project');
        version = core.getInput('version');
        token = core.getInput('auth-token');

        const versionName = getVersionName(version)
        if (versionName == null) {
            core.setFailed(`version is not correct: [${version}] must be '1.0.0'/'v1.0.0'/'test 1.0.0' pattern`);
            return
        }
        const appName = version.replace(versionName, '').trim()
        console.log(`appName: ${appName}, versionName: ${versionName}`)
        const versions = await getVersions(appName)
        if (versions.length < 1) {
            core.setFailed(`[${version}] is not exist`);
            return
        }
        const currentVersion = versions.find(value => {
            return value.name === version
        })
        if (currentVersion == null) {
            core.setFailed(`[${version}] is not exist`);
            return
        }
        await releaseVersion(currentVersion.id)
        let nextVersion
        if (isHotfixVersionName(versionName)) {
            nextVersion = versions[versions.length - 1].name
            console.log("Hotfix version don't create new version")
        } else {
            nextVersion = await createNextVersion(versions)
        }
        core.setOutput("new-version", nextVersion);
    } catch (error) {
        core.setFailed(error.message);
    }
})();

function getVersionName(version) {
    const regexp = new RegExp(".*(\\d{1,2}\\.\\d{1,2}\\.\\d{1,3})", "g");
    const match = regexp.exec(version);
    if (match == null || match.length < 1) {
        return null
    }
    return match[1]
}

async function getVersions(appName) {
    const uri = `https://${domain}.atlassian.net/rest/api/3/project/${project}/version?query=${encodeURI(appName)}&orderBy=name&status=unreleased`
    const options = {
        method: 'GET',
        uri: uri,
        headers: {
            Authorization: `Basic ${token}`
        },
        json: true,
    };

    const result = await rp(options)
    return result.values.filter((value) => {
        const name = value.name
        const versionName = getVersionName(name)
        const targetName = value.name.replace(versionName, '').trim()
        return targetName === appName
    })
}

async function releaseVersion(versionId) {
    console.log("Trying release version")
    const uri = `https://${domain}.atlassian.net/rest/api/3/version/${versionId}`
    const options = {
        method: 'PUT',
        uri: uri,
        body: {
            released: true,
            releaseDate: new Date().toISOString().slice(0, 10)
        },
        headers: {
            Authorization: `Basic ${token}`
        },
        json: true,
    };

    const result = await rp(options)
    console.log(result)
    console.log("Release version success!")
}

function isHotfixVersionName(versionName) {
    const regexp = new RegExp(".*\\d{1,2}\\.\\d{1,2}\\.(\\d{1,3})", "g");
    const patchVersion = regexp.exec(versionName)[1] * 1;
    return patchVersion !== 0
}

async function createNextVersion(versions) {
    console.log("Trying create new version")
    const nextVersion = getNextVersion(versions)
    const projectId = versions[versions.length - 1].projectId
    const uri = `https://${domain}.atlassian.net/rest/api/3/version`
    const options = {
        method: 'POST',
        uri: uri,
        body: {
            name: nextVersion,
            projectId: projectId,
        },
        headers: {
            Authorization: `Basic ${token}`
        },
        json: true,
    };

    const result = await rp(options)
    console.log(result)
    console.log("Create new version success!: ", nextVersion)
    return nextVersion
}

function getNextVersion(versions) {
    const lastVersion = versions[versions.length - 1].name
    // Find minor version 1.[0].0
    const regexp = new RegExp(".*\\d{1,2}(\\.\\d{1,2}\\.)\\d{1,3}", "g");
    const lastMinorVersion = regexp.exec(lastVersion)[1];
    // Version change 1.0.0 -> 1.1.0
    const nextMinorVersionCode = lastMinorVersion.replace('.', '') * 1 + 1
    return lastVersion.replace(lastMinorVersion, `.${nextMinorVersionCode}.`)
}
