export const getQuery = function (key) {
  return (location.search.substr(1).match(new RegExp("(?:^|&)" + key + "=(.+?)(?:$|&)")) || ["", "我是默认值, 因为前面为空就到我了"])[1];
}