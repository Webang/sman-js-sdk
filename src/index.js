import { initUser, getUserId } from './user';
import { initXhr } from './xhr';
import { initErrorEvent } from './catchError';
import { generateUUID } from './util';
import axios from 'axios';

let config = {};

const sman = {
  init(opt) {
    config = opt;
    initUser(this);
    initXhr(this);
    initErrorEvent(this);
  },

  // 获取公共参数
  getCommonParams() {
    return {
      event_id: generateUUID(),
      user_id: getUserId(),
      platform: 'javascript',
      time: Date.now(),
      request: {
        url: window.location.href,
        'User-Agent': window.navigator.userAgent
      },
    }
  },

  /**
   * @description JS异常|资源加载异常
   * @param {*} exception 
   */
  sendErrorEevent(exception) {
    const payload = this.getCommonParams();
    payload.exception = exception;
    axios({
      url: `${config.url}/error/add`,
      method: 'POST',
      data: payload
    });
  },

  // 接口请求上报
  sendXhrEvent(data) {
    const payload = this.getCommonParams();
    axios({
      url: `${config.url}/gateway-event/create`,
      method: 'POST',
      data: {
        ...data,
        event_id: generateUUID(),
        user_id: getUserId(),
        platform: 'javascript',
        time: Date.now(),
        page_url: window.location.href
      },
      headers: {
        _exclude_: 1
      }
    });
  }
}

sman.init({
  appkey: '6Wdfr6MCuo6Q9DGC',
  url: 'http://localhost:3030'
});

export default sman;
