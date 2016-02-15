export default function(va) {
  var out = [];
  var getProps = function (obj,b) {
      for (var property in obj) {
          if (obj.hasOwnProperty(property) && obj[property] !== null) {
              if (obj[property].constructor === Object) {
                  getProps(obj[property],true);
              } else if (obj[property].constructor === Array) {
                  for (var i = 0; i < obj[property].length; i++) {
                      getProps(obj[property][i]);
                  }
              } else {
                  out.push({key : property, value : obj[property], b : b});
                  if (b === true) {
                     b = false;
                  }
              }
          }
      }
  };
  getProps(va);
  return out;
}
