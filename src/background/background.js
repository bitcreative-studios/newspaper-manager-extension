const DEFAULT_COLOR = '#ff0844'

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: DEFAULT_COLOR }, function () {
    console.log(`The  color is ${DEFAULT_COLOR}`)
  })
})
