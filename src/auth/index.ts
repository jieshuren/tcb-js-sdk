import { Request } from "../lib/request"
import WeixinAuthProvider from "./weixinAuthProvider"
import { addEventListener } from "./listener"
import Base from "./base"
import { activateEvent } from "./listener"

import { Cache } from "../lib/cache"
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_Expire,
  REFRESH_TOKEN,
  Config
} from "../types"

// enum Persistence {
//   local = 'local',
//   session = 'session',
//   none = 'none'
// }

export interface UserInfo {
  openid: string
  nickname?: string
  sex?: number
  province?: string
  city?: string
  country?: string
  headimgurl?: string
  privilege?: [string]
  unionid?: string
}

export default class Auth extends Base {
  httpRequest: Request
  config: Config

  constructor(config: Config) {
    super(config)
    // this.httpRequest = new Request(config);
    this.config = config
  }

  weixinAuthProvider({ appid, scope, loginMode, state }) {
    return new WeixinAuthProvider(this.config, appid, scope, loginMode, state)
  }

  signOut() {
    let cache = new Cache(this.config.persistence)
    cache.removeStore(`${REFRESH_TOKEN}_${this.config.env}`)
    cache.removeStore(`${ACCESS_TOKEN}_${this.config.env}`)
    cache.removeStore(`${ACCESS_TOKEN_Expire}_${this.config.env}`)

    const action = "auth.logout"
    return this.httpRequest.send(action, {}).then(res => {
      return res
    })
  }

  getAccessToken() {
    // 调getJWT获取access_token
    let cache = new Cache(this.config.persistence)

    return new Promise((resolve, reject) => {
      if (!cache.getStore(this.refreshTokenKey)) {
        // console.log("LoginStateExpire")
        activateEvent("LoginStateExpire")
        reject({ err: { message: "LoginStateExpire" } })
      } else {
        // console.log("this********", this)
        this.getJwt()
          .then(res => {
            console.log("get jwt res:", res)
            if (res.code === "REFRESH_TOKEN_Expired") {
              // 用户需重新登录
              // console.log("REFRESH_TOKEN_Expired")
              reject({ err: { message: "REFRESH_TOKEN_Expired" } })
            }

            if (!res.code) {
              // 从cache里取accesstoken
              let accessToken = cache.getStore(this.accessTokenKey)
              console.log("get access_token*********:", accessToken)
              //
              resolve({
                accessToken,
                env: this.config.env
              })
              // callback(accessToken, this.config.env)
            }
          })
          .catch(err => {
            // console.log("err:", err)
            reject({ err })
          })
      }
    })
  }

  onLoginStateExpire(callback: Function) {
    addEventListener("LoginStateExpire", callback)
  }

  getUserInfo(): any {
    const action = "auth.getUserInfo"

    return this.httpRequest.send(action, {}).then(res => {
      if (res.code) {
        return res
      } else {
        return {
          ...res.data,
          requestId: res.seqId
        }
      }
    })
  }
}
