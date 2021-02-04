
import axios from 'axios'
import { genUUID } from './util'
import { initXhr } from './xhr'
import { initErrorEvent } from './error'
import { initUser, getUserId } from './user'
import { initPerformance } from './performance';

let config = {};
// let count = 0;
// let maxCount = 99;

const sman = {
  init(opt) {
    config = opt;
    initUser(this);
    initXhr(this);
    initErrorEvent(this);
    initPerformance(this);

    // SDK 数据上报接口URL
    this.addErrorUrl = opt.url + '/error/add';
    this.addGatewayUrl = opt.url + '/gateway/create';
    this.addPageViewUrl = opt.url + '/page-view/add';

    // 以下URL的请求不上报，避免死循环
    this.ajaxWhiteUrl = [
      this.addErrorUrl,
      this.addGatewayUrl,
      this.addPageViewUrl,
    ]
  },

  // 获取公共参数
  getCommonParams() {
    return {
      appkey: config.appkey,
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
      axios({
        url: this.addErrorUrl,
        method: 'POST',
        data: payload,
        headers: {
          is_report: 1
        }
      }).catch(e => {
        console.log(e);
      })
  },

  // 页面性能
  sendPageView(params) {
    const payload = this.getCommonParams()
    axios({
      url: this.addPageViewUrl,
      method: 'POST',
      data: {
        page_title: document.title,
        ...payload,
        ...params,
      }
    }).catch(e => {
      console.log(e)
    })
  },

  // 接口请求上报
  sendXhrEvent(data) {
    const payload = this.getCommonParams()
    axios({
      url: this.addGatewayUrl,
      method: 'POST',
      data: {
        ...payload,
        ...data,
      }
    }).catch(e => {
      console.log(e)
    })
  },
}

// sman.init({
//   appkey: '6Wdfr6MCuo6Q9DGC',
//   url: 'http://localhost:3030',
// })

export default sman
