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

/**
 * A binding string azonosítóval meghívott események esetén futtatja le az f függvény
 * @param binding
 * @param f
 * @constructor
 */
EventCreator.EventListener = function(binding,f) {
    document.addEventListener(binding,f);
};