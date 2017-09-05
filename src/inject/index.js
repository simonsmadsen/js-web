import * as pack from 'js-pack'
import * as socal from 'js-social'
import * as cdns from './cdns'
import config from './../config'

export * from './react'
export { pack } from 'js-pack'
const fs = require('fs')

const isURL = str => new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?",'i').test(str)

export function jquery() {
  return pack.scriptCDN(cdns.jquery)
}

export function socketIO() {
  return pack.scriptCDN(cdns.socketIO)
}

export function bootstrap() {
  return [
    pack.scriptCDN(cdns.bootstrapJS),
    pack.cssCDN(cdns.bootstrapCSS)
  ]
}

export function style(str) {
  if (isURL(str)) {
    return pack.cssCDN(str)
  }
  if (!fs.existsSync(str)) {
    console.log(`${str} - file not exists!`)
    return pack.cssRAW('')
  }
  if (str.indexOf('.sass') > -1 || str.indexOf('.scss') > -1) { // .sass||.scss
    return pack.sass(str)
  }
  if (str.indexOf('.styl') > -1) {
    return pack.stylus(str)
  }
  return pack.cssFile(str)
}

export function facebookAuth(okCallback, bindClass, scope) {
  return pack.scriptRAW(socal.facebookAuthScript(
    config.facebook_app_id,
    okCallback,
    bindClass,
    scope
  ))
}

export function googleAnalytics() {
  return pack.scriptRAW(`
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', '${config.google_analytics}', 'auto');
    ga('send', 'pageview');`
  )
}

export function googleAuth(okCallback, bindClass, scope) {
  return pack.scriptRAW(socal.googleAuthScript(
    config.google_client_id,
    config.google_api_key,
    okCallback,
    bindClass,
    scope
  ))
}

export function script(str) {
  if (isURL(str)) {
    return pack.scriptCDN(str)
  }
  if (!fs.existsSync(str)) {
    console.log(`${str} - file not exists!`)
    return pack.scriptRAW('')
  }
  return pack.scriptFile(str)
}
