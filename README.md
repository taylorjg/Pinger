
## Description

* SignalR
* OWIN self hosting
* Gulp (including integration with Visual Studio 2015)

## Screenshot

![Screenshot](https://raw.github.com/taylorjg/Pinger/master/Images/Screenshot.png)

## Future Plans

* Add Jasmine unit tests for the existing "no UI framework" client
* Add a client using AngularJS 1.x
    * Have a go at using [angular-hint](https://github.com/angular/angular-hint)
    * Adhere to best practices
        * [Angular Style Guide](https://github.com/johnpapa/angular-styleguide)
* Add a client using AngularJS 2 (with code in JavaScript)
* Add a client using AngularJS 2 (with code in TypeScript)
* Add a client using React

## Regarding angular-hint

I included angular-hint in my `ng1` client. However, I wasn't seeing any output in the browser console (even though I had some deliberate mistakes). After some digging, I came across issue #81 in the angular-hint issues:

* [angular.hint.onMessage is empty function](https://github.com/angular/angular-hint/issues/81)

Based on this, I added the following code to listen for messages from angular-hint:

```js
if (window.angular.hint) {
    window.angular.hint.onAny(function () {
        if (arguments.length >= 2) {
            var severity = arguments[1];
            var fn;
            switch (severity) {
                case 1: /* SEVERITY_ERROR */ fn = console.error; break;
                case 2: /* SEVERITY_WARNING */ fn = console.warn; break;
                case 3: /* SEVERITY_SUGGESTION */ fn = console.info; break;
                default: fn = console.log; break;
            }
            var prefix = "[angular-hint]";
            if (arguments.length === 2) {
                fn.call(console, prefix, arguments[0]);
            }
            else {
                fn.call(console, prefix, arguments[0], "(" + arguments[2] + ")");
            }
        }
    });
}
```
