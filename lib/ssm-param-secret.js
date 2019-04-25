const AWS = require('aws-sdk')
const NodeCache = require('node-cache')

const CACHE_KEY = 'service2service'

const stsInstance = new AWS.STS()

function getSecretFunc(options) {
  const cache = new NodeCache({ stdTTL: 14400 })
  return function getSSMParamService2ServiceSecret() {
    if (cache.get(CACHE_KEY)) {
      return cache.get(CACHE_KEY)
    }
    return getSSMParamValues(options)
        .then((val) => {
          cache.set(CACHE_KEY, val)
          return val
        })
  }
}

function getSSMParamValues({
    ssmRoleToAssume,
    ssmParameterName,
    ssmRegion = 'us-west-2',
    ssmRoleSessionName = 'Service2ServiceAppSession'
}) {
  const assumeParams = {
    RoleArn: ssmRoleToAssume,
    RoleSessionName: ssmRoleSessionName
  }

  return stsInstance.assumeRole(assumeParams).promise()
        .then(({ Credentials }) => {
          const ssmInstance = new AWS.SSM({
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            region: ssmRegion
          })
          return ssmInstance.getParameter({
            Name: ssmParameterName,
            WithDecryption: true
          }).promise()
        })
    .then(({ Parameter: { Value }}) => Value)
    .then((val) => val.split(','))
}

module.exports = getSecretFunc
