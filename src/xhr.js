/**
 * 统计 xhr 耗时
 */
export function initXhr(ctx) {
  const MXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = function (...arg) {
    const request = new MXMLHttpRequest(...arg);
    const start_time = Date.now();

    request.addEventListener('readystatechange', function (e) {
      const xmlhttp = e.target;
      if (xmlhttp.readyState == 4) {
        const end_time = Date.now();
        const reqUrl = xmlhttp.responseURL.split('?')[0];
        if (ctx.ajaxWhiteUrl.indexOf(reqUrl) === -1) {
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

    return request;
  }
}
