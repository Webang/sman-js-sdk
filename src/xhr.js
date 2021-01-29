/**
 * 统计 xhr 消耗
 */
export function initXhr(ctx) {
  const MXMLHttpRequest = window.XMLHttpRequest

  window.XMLHttpRequest = function (...arg) {
    const m = new MXMLHttpRequest(...arg)
    const start_time = Date.now()
    let count = 0

    m.addEventListener('readystatechange', function (e) {
      const xmlhttp = e.target
      if (xmlhttp.readyState == 4) {
        const end_time = Date.now()
        const reqUrl = xmlhttp.responseURL

        // 暂时使用 url 来避免死循环
        if (
          reqUrl.indexOf('gateway/create') === -1 &&
          reqUrl.indexOf('/error/add') === -1 &&
          reqUrl.indexOf('/page-view/add') === -1 &&
          count < 1
        ) {
          count++
          ctx.sendXhrEvent({
            start_time: start_time,
            end_time: end_time,
            spend_time: end_time - start_time,
            url: xmlhttp.responseURL.split('?')[0],
            http_code: xmlhttp.status
          })
        }
      }
    })

    return m
  }
}
