
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

## Regarding Integration of Gulp and Visual Studio

I wanted to be able to determine the current build configuration name
from within my `gulpfile.js` when executing it as part of a build in Visual Studio.
There doesn't seem to be a good way to achieve this. I came up with the
following which is a bit of a hack but better than nothing.

I use a pre-build step to create a file called `prebuild.json` containing
the current build configuration name:

```bat
echo { "configurationName": "$(ConfigurationName)" } > $(ProjectDir)prebuild.json
```

I then read `prebuild.json` from my `gulpfile.js` using `require`. I use a `try`/`catch`
in case `prebuild.json` does not exist - in which case I use default values:

```js
var configurationName;
try {
    var prebuild = require("./prebuild.json");
    configurationName = prebuild.configurationName;
} catch (err) {
    console.log("Missing prebuild.json - using default values");
    configurationName = "Debug";
}
configurationName = configurationName.toLowerCase();
console.log("configurationName: " + configurationName);
```
