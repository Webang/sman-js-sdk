/**
 * 统计 xhr 消耗
 */
export function initXhr(ctx) {
  const MXMLHttpRequest = window.XMLHttpRequest;
  
  window.XMLHttpRequest = function (...arg) {
    const m = new MXMLHttpRequest(...arg);
    const start_time = Date.now();

    m.addEventListener('readystatechange', function(e) {
      const xmlhttp = e.target;
      if (xmlhttp.readyState == 4) { // 4 = "loaded"
        const end_time = Date.now();
        // 暂时使用 url 来避免死循环
	    	if (xmlhttp.responseURL.indexOf('gateway-event/create') === -1) {
		    	ctx.sendXhrEvent({
		    		start_time: start_time,
		    		end_time: end_time,
		    		spend_time: end_time - start_time,
		    		url: xmlhttp.responseURL.split('?')[0]
		    	});
	    	}
      }
    });

    return m;
  }
}