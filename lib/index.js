function resolveStack(e) {
  const frames = [];
  const list = e.error.stack.split('\n');

  list.forEach((element, index) => {
    if (index !== 0) {
      const reg = /^(    at)( .*)?( .*)$/;
      let [, , arg2, arg3] = reg.exec(element);
      let fun = arg2 ? arg2.replace(/\s/g, '') : '?';

      const [protol, filename, lineno, colno] = arg3
        .replace(/\s/g, '')
        .replace('(', '')
        .replace(')', '')
        .split(':');

      frames.push({
        filename: protol + ':' + filename, // 文件名
        colno: +colno, // 列数
        function: fun, // 调用函数
        lineno: +lineno // 行数
      });
    }
  });
  return frames;
}

// catch resource load error, such as js css img...
window.addEventListener('error', function (e) {
  const target = e.target;
  if (target !== window) {
    console.log({
      type: target.localName,
      url: target.src || target.href,
      msg: (target.src || target.href) + ' load error',
      time: new Date().getTime(),
    });
  }
}, true);

// catch Promise.reject
window.addEventListener('unhandledrejection', function(e) {
  console.log(e);
  console.log({
    type: 'promise',
    url: window.location.href,
    msg: (e.reason && e.reason.msg) || e.reason || '',
    time: new Date().getTime(),
  });
});

// catch js error which is not Promise.reject
window.addEventListener('error', function(e) {
  const [type, value] = e.message.replace('Uncaught ', '').split(': ');
  const payload = {
    time: Date.now(),
    event_id: "4c460712c9b0476ebe45fcf37026e14b",
    platform: 'javascript',
    request: {
      url: "file:///Users/arraybuffer/Desktop/sentry/02-sentry/index.html",
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
    },
    exception: {
      type: type,
      value: value,
      stacktrace: {
        frames: resolveStack(e)
      }
    }
  };
  console.log(payload);
});
