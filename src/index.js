
import axios from 'axios'
import { genUUID } from './util'
import { initXhr } from './xhr'
import { initErrorEvent } from './error'
import { initUser, getUserId } from './user'
import { initPerformance } from './performance';

let config = {}
let count = 0

const sman = {
  init(opt) {
    config = opt
    initUser(this)
    initXhr(this)
    initErrorEvent(this)
    initPerformance(this)
  },

  // 获取公共参数
  getCommonParams() {
    return {
      event_id: genUUID(),
      user_id: getUserId(),
      platform: 'javascript',
      time: Date.now(),
      request: {
        url: window.location.href,
        'User-Agent': window.navigator.userAgent,
      },
    }
  },

  /**
   * @description JS异常|资源加载异常
   * @param {*} exception
   */
  sendErrorEevent(exception) {
    const payload = this.getCommonParams()
    payload.exception = exception
    if (count < 4) {
      count++
      axios({
        url: `${config.url}/error/add`,
        method: 'POST',
        data: payload,
      })
    }
  },

  sendPageView(params) {
    const payload = this.getCommonParams()
    axios({
      url: `${config.url}/page-view/add`,
      method: 'POST',
      data: {
        page_title: document.title,
        ...payload,
        ...params,
      }
    })
  },

  // 接口请求上报
  sendXhrEvent(data) {
    const payload = this.getCommonParams()
    axios({
      url: `${config.url}/gateway/create`,
      method: 'POST',
      data: {
        ...payload,
        ...data,
      }
    })
  },
}

sman.init({
  appkey: '6Wdfr6MCuo6Q9DGC',
  url: 'http://localhost:3030',
})

export default sman
