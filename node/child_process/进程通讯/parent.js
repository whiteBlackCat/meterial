var child_process = require('child_process')

var child = child_process.spawn('node', ['child.js']);
child.kill('SIGTERM');


child.stdout.on('data', function (data) {
  console.log('data', data)
})
child.stderr.on('data', function (data) {
  console.log('data', data)
});
child.on('close', function (code) {
  console.log('code', code)
});