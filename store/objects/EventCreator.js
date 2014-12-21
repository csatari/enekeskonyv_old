/**
 * Created by Albert on 2014.12.21..
 */
/***
 * Események egyszerű létrehozására egy osztály
 * @constructor
 */
function EventCreator() {
}

/***
 * A binding string azonosítóval azonosított eseményt meghívja
 * @param binding
 */
EventCreator.CallEvent = function(binding) {
    var event = new Event(binding);
    document.dispatchEvent(event);
};

EventCreator.EventListener = function(binding,f) {
    document.addEventListener(binding,f);
};