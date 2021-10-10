function spawn(mainModule) {
  var worker = child_process.spawn('node', [mainModule]);

  worker.on('exit', function (code) {
    if (code !== 0) {
      spawn(mainModule);
    }
  });
}