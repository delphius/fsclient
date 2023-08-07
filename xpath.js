function nullHandler(string) {
  return string;
}

function extractUrlFromUri(uri) {
  const queryParams = new URLSearchParams(uri.slice(uri.indexOf('?') + 1));
  return queryParams.get('src');
}

function removeDuplicateParts(string) {
  return string.substring(14, string.length - 13);
}

async function extractElementsByXPath(url, xpathAttributesMap, resultFormat) {
  const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=' + url;

  const response = await fetch(proxyUrl);
  const text = await response.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'text/html');

  const result = {};

  for (const resultItem of resultFormat) {
    const { key, xpath, attribute } = resultItem;
    const attributeHandlers = xpathAttributesMap[xpath];
    const iterator = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

    let node = iterator.iterateNext();
    const elements = [];

    while (node) {
      const attributes = node.attributes;
      const element = {};

      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        const attributeName = attr.name;

        if (attributeHandlers.hasOwnProperty(attributeName)) {
          const handler = attributeHandlers[attributeName];
          element[attributeName] = handler(attr.value);
        }
      }

      elements.push(element);
      node = iterator.iterateNext();
    }

    if (elements.length > 0) {
      result[key] = elements;
    }
  }

  const outputJson = transformJson(result, resultFormat);
  return outputJson;
}

function transformJson(inputJson, resultFormat) {
  var outputJson = [];

  for (var i = 0; i < inputJson[resultFormat[0].key].length; i++) {
    var item = {};

    for (var j = 0; j < resultFormat.length; j++) {
      var key = resultFormat[j].key;
      var xpath = resultFormat[j].xpath;
      var attribute = resultFormat[j].attribute;

      item[key] = inputJson[key][i][attribute];
    }

    outputJson.push(item);
  }

  return outputJson;
}