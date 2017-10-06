const env = require('dotenv')
const axios = require('axios')
const fs = require('fs')

const envFileUrl =
'https://raw.githubusercontent.com/simonsmadsen/js-web/master/.env_template'

const templatePath =
`${__dirname}/../template-files/.env_template`

const downloadEnv = () =>
  axios.get(envFileUrl).then((r) => {
    fs.writeFileSync(`${process.cwd()}/.env`, r.data)
  })

const getTemplateConfig = () =>
  env.config({ path: templatePath }).parsed

const getConfig = () =>
  env.config().parsed

const downloadAndLoadTemplate = () => {
  downloadEnv()
  return getTemplateConfig()
}

const backupConfig = {
  port: 8080,
  allowCrossDomain: false,
  https: false,
  mysql_host: 'localhost',
  mysql_user: 'root',
  mysql_password: '',
  mysql_database: '',
  mysql_soft_delete: false,
  mysql_soft_delete_field: 'deleted',
  mysql_query_debug: false,
  mysql_port: 3306
}

const config = getConfig() || downloadAndLoadTemplate() || backupConfig

export default config
