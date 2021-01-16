const DEFAULT_COLOR = '#ff0844'

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: DEFAULT_COLOR }, function () {
    console.log(`The color is ${DEFAULT_COLOR}.`)
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.open.online' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})
