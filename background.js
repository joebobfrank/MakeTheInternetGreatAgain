// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function () {

var _DICT = null;

var clients = {};

var init = function () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('dictionary.txt'), true);
  xhr.onreadystatechange = function()
  {
    if  (_DICT == null) {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
      {
        _DICT = {};
        xhr.responseText.split('\n').forEach(function(s) {
          var strs = s.split('@');
          _DICT[strs[0]] = strs[1].substr(1);
        }.bind(this));
        console.log("Done!");
      }
    }
  };
  xhr.send();
}.bind(this);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse({dict: JSON.stringify(_DICT)});
    var port = chrome.tabs.connect(sender.tab.id);
    port.onDisconnect.addListener(function(id) {
      delete clients[sender.tab.id];
    }.bind(sender.tab.id));
    clients[sender.tab.id] = port;
}.bind(this));

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  if (!_DICT) {
    init();
    return;
  }
  console.log('Making ' + tab.url + ' great again!');
  var port = clients[tab.id];
  if (port) {
    port.postMessage({dict: ""});
  } else {
    chrome.tabs.executeScript({file: 'content.js'});
  }
  // No tabs or host permissions needed!

  
  
}.bind(this));


})();
