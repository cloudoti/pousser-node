export function stringify(): string {
    var m = ['Pousser'];
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'string') {
        m.push(arguments[i]);
      } else {
        m.push(safeJSONStringify(arguments[i]));
      }
    }
    return m.join(' : ');
  }

  export function safeJSONStringify(source: any): string {
    try {
      return JSON.stringify(source);
    } catch (e) {
      return JSON.stringify(decycleObject(source));
    }
  }

  export function decycleObject(object: any): any {
    var objects = [],
      paths = [];
  
    return (function derez(value, path) {
      var i, name, nu;
  
      switch (typeof value) {
        case 'object':
          if (!value) {
            return null;
          }
          for (i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return { $ref: paths[i] };
            }
          }
  
          objects.push(value);
          paths.push(path);
  
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            nu = [];
            for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']');
            }
          } else {
            nu = {};
            for (name in value) {
              if (Object.prototype.hasOwnProperty.call(value, name)) {
                nu[name] = derez(
                  value[name],
                  path + '[' + JSON.stringify(name) + ']'
                );
              }
            }
          }
          return nu;
        case 'number':
        case 'string':
        case 'boolean':
          return value;
      }
    })(object, '$');
  }