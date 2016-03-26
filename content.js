(function() {

var _DICT = null;

var makeTheInternetGreatAgain = function() {
  for (var z = 0; z < 1; ++z) {
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3 && node.parentNode.nodeName != "SCRIPT") {
          console.log(node.parentNode.nodeName);
          var text = node.nodeValue;
          var vals = text.split(' ');
          vals.forEach(function(s) {
            if (s.length > 5) {
              var rep = _DICT[s.toUpperCase()];
              if (rep) {
                var text2 = node.nodeValue;
                var replacedText = text2.replace(new RegExp(s, 'gi'), rep.toLowerCase());

                if (replacedText !== text2) {
                  var newnode = document.createTextNode(replacedText);
                  element.replaceChild(newnode, node);
                  node = newnode;
                }
              }
            }
          });
        }
      }
    }
  }
};

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    makeTheInternetGreatAgain();
  });
});

chrome.runtime.sendMessage({asdf : "asdf"}, function(response) {
  if (!_DICT) {
    _DICT = JSON.parse(response.dict);
  }
  console.log("Great");
  makeTheInternetGreatAgain();
});


console.log('test');

})();