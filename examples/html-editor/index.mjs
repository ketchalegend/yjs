
import YWebsocketsConnector from '../../src/Connectors/WebsocketsConnector/WebsocketsConnector.mjs'
import Y from '../../src/Y.mjs'
import DomBinding from '../../src/Bindings/DomBinding/DomBinding.mjs'
import UndoManager from '../../src/Util/UndoManager.mjs'
import YXmlFragment from '../../src/Types/YXml/YXmlFragment.mjs'
import YIndexdDBPersistence from '../../src/Persistences/IndexedDBPersistence.mjs'

const connector = new YWebsocketsConnector()
const persistence = new YIndexdDBPersistence()
const y = new Y('html-editor', null, null, { gc: true })
persistence.connectY('html-editor', y).then(() => {
  // connect after persisted content was applied to y
  // If we don't wait for persistence, the other peer will send all data, waisting
  // network bandwidth..
  connector.connectY('html-editor', y)
})

window.connector = connector
window.persistence = persistence

window.onload = function () {
  window.domBinding = new DomBinding(window.yXmlType, document.body, { scrollingElement: document.scrollingElement })
}

window.y = y
window.yXmlType = y.define('xml', YXmlFragment)
window.undoManager = new UndoManager(window.yXmlType, {
  captureTimeout: 500
})

document.onkeydown = function interceptUndoRedo (e) {
  if (e.keyCode === 90 && (e.metaKey || e.ctrlKey)) {
    if (!e.shiftKey) {
      window.undoManager.undo()
    } else {
      window.undoManager.redo()
    }
    e.preventDefault()
  }
}