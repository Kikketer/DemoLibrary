(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.demoLibrary = {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /*
     * This module exists for optimizations in the build process through rollup and terser.  We define some global
     * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
     * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
     * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
     * `logger` and preventing node-related code from appearing in browser bundles.
     *
     * Attention:
     * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
     * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
     * having issues tree-shaking these constants across package boundaries.
     * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
     * users to be able to shake away expressions that it guards.
     */
    /**
     * Figures out if we're building a browser bundle.
     *
     * @returns true if this is a browser bundle build.
     */
    function isBrowserBundle() {
        return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
    }

    /**
     * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
     * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
     */
    /**
     * Checks whether we're in the Node.js or Browser environment
     *
     * @returns Answer to given question
     */
    function isNodeEnv() {
        // explicitly check for browser bundles as those can be optimized statically
        // by terser/rollup.
        return (!isBrowserBundle() &&
            Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]');
    }
    /**
     * Requires a module which is protected against bundler minification.
     *
     * @param request The module path to resolve
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    function dynamicRequire(mod, request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return mod.require(request);
    }

    /**
     * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
     * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
     */
    var fallbackGlobalObject = {};
    /**
     * Safely get global scope object
     *
     * @returns Global scope object
     */
    function getGlobalObject() {
        return (isNodeEnv()
            ? global
            : typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
                ? window // eslint-disable-line no-restricted-globals
                : typeof self !== 'undefined'
                    ? self
                    : fallbackGlobalObject);
    }
    /**
     * Returns a global singleton contained in the global `__SENTRY__` object.
     *
     * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
     * function and added to the `__SENTRY__` object.
     *
     * @param name name of the global singleton on __SENTRY__
     * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
     * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `getGlobalObject`'s return value
     * @returns the singleton
     */
    function getGlobalSingleton(name, creator, obj) {
        var global = (obj || getGlobalObject());
        var __SENTRY__ = (global.__SENTRY__ = global.__SENTRY__ || {});
        var singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
        return singleton;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    var objectToString = Object.prototype.toString;
    function isBuiltin(wat, ty) {
        return objectToString.call(wat) === "[object " + ty + "]";
    }
    /**
     * Checks whether given value's type is an object literal
     * {@link isPlainObject}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isPlainObject(wat) {
        return isBuiltin(wat, 'Object');
    }
    /**
     * Checks whether given value has a then function.
     * @param wat A value to be checked.
     */
    function isThenable(wat) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return Boolean(wat && wat.then && typeof wat.then === 'function');
    }

    /*
     * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
     * for users.
     *
     * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
     * because some build tools have trouble tree-shaking imported guards.
     *
     * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
     *
     * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
     * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
     * replaced.
     */
    /** Flag that is true for debug builds, false otherwise. */
    var IS_DEBUG_BUILD$1 = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;

    // TODO: Implement different loggers for different environments
    var global$1 = getGlobalObject();
    /** Prefix for logging strings */
    var PREFIX = 'Sentry Logger ';
    var CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert'];
    /**
     * Temporarily disable sentry console instrumentations.
     *
     * @param callback The function to run against the original `console` messages
     * @returns The results of the callback
     */
    function consoleSandbox(callback) {
        var global = getGlobalObject();
        if (!('console' in global)) {
            return callback();
        }
        var originalConsole = global.console;
        var wrappedLevels = {};
        // Restore all wrapped console methods
        CONSOLE_LEVELS.forEach(function (level) {
            // TODO(v7): Remove this check as it's only needed for Node 6
            var originalWrappedFunc = originalConsole[level] && originalConsole[level].__sentry_original__;
            if (level in global.console && originalWrappedFunc) {
                wrappedLevels[level] = originalConsole[level];
                originalConsole[level] = originalWrappedFunc;
            }
        });
        try {
            return callback();
        }
        finally {
            // Revert restoration to wrapped state
            Object.keys(wrappedLevels).forEach(function (level) {
                originalConsole[level] = wrappedLevels[level];
            });
        }
    }
    function makeLogger() {
        var enabled = false;
        var logger = {
            enable: function () {
                enabled = true;
            },
            disable: function () {
                enabled = false;
            },
        };
        if (IS_DEBUG_BUILD$1) {
            CONSOLE_LEVELS.forEach(function (name) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                logger[name] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (enabled) {
                        consoleSandbox(function () {
                            var _a;
                            (_a = global$1.console)[name].apply(_a, __spread([PREFIX + "[" + name + "]:"], args));
                        });
                    }
                };
            });
        }
        else {
            CONSOLE_LEVELS.forEach(function (name) {
                logger[name] = function () { return undefined; };
            });
        }
        return logger;
    }
    // Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
    var logger;
    if (IS_DEBUG_BUILD$1) {
        logger = getGlobalSingleton('logger', makeLogger);
    }
    else {
        logger = makeLogger();
    }

    /**
     * Given any object, return the new object with removed keys that value was `undefined`.
     * Works recursively on objects and arrays.
     */
    function dropUndefinedKeys(val) {
        var e_1, _a;
        if (isPlainObject(val)) {
            var rv = {};
            try {
                for (var _b = __values(Object.keys(val)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    if (typeof val[key] !== 'undefined') {
                        rv[key] = dropUndefinedKeys(val[key]);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return rv;
        }
        if (Array.isArray(val)) {
            return val.map(dropUndefinedKeys);
        }
        return val;
    }

    /**
     * UUID4 generator
     *
     * @returns string Generated UUID4.
     */
    function uuid4() {
        var global = getGlobalObject();
        var crypto = global.crypto || global.msCrypto;
        if (!(crypto === void 0) && crypto.getRandomValues) {
            // Use window.crypto API if available
            var arr = new Uint16Array(8);
            crypto.getRandomValues(arr);
            // set 4 in byte 7
            // eslint-disable-next-line no-bitwise
            arr[3] = (arr[3] & 0xfff) | 0x4000;
            // set 2 most significant bits of byte 9 to '10'
            // eslint-disable-next-line no-bitwise
            arr[4] = (arr[4] & 0x3fff) | 0x8000;
            var pad = function (num) {
                var v = num.toString(16);
                while (v.length < 4) {
                    v = "0" + v;
                }
                return v;
            };
            return (pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]));
        }
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // eslint-disable-next-line no-bitwise
            var r = (Math.random() * 16) | 0;
            // eslint-disable-next-line no-bitwise
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    /**
     * Thenable class that behaves like a Promise and follows it's interface
     * but is not async internally
     */
    var SyncPromise = /** @class */ (function () {
        function SyncPromise(executor) {
            var _this = this;
            this._state = 0 /* PENDING */;
            this._handlers = [];
            /** JSDoc */
            this._resolve = function (value) {
                _this._setResult(1 /* RESOLVED */, value);
            };
            /** JSDoc */
            this._reject = function (reason) {
                _this._setResult(2 /* REJECTED */, reason);
            };
            /** JSDoc */
            this._setResult = function (state, value) {
                if (_this._state !== 0 /* PENDING */) {
                    return;
                }
                if (isThenable(value)) {
                    void value.then(_this._resolve, _this._reject);
                    return;
                }
                _this._state = state;
                _this._value = value;
                _this._executeHandlers();
            };
            /** JSDoc */
            this._executeHandlers = function () {
                if (_this._state === 0 /* PENDING */) {
                    return;
                }
                var cachedHandlers = _this._handlers.slice();
                _this._handlers = [];
                cachedHandlers.forEach(function (handler) {
                    if (handler[0]) {
                        return;
                    }
                    if (_this._state === 1 /* RESOLVED */) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        handler[1](_this._value);
                    }
                    if (_this._state === 2 /* REJECTED */) {
                        handler[2](_this._value);
                    }
                    handler[0] = true;
                });
            };
            try {
                executor(this._resolve, this._reject);
            }
            catch (e) {
                this._reject(e);
            }
        }
        /** JSDoc */
        SyncPromise.prototype.then = function (onfulfilled, onrejected) {
            var _this = this;
            return new SyncPromise(function (resolve, reject) {
                _this._handlers.push([
                    false,
                    function (result) {
                        if (!onfulfilled) {
                            // TODO: ¯\_(ツ)_/¯
                            // TODO: FIXME
                            resolve(result);
                        }
                        else {
                            try {
                                resolve(onfulfilled(result));
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                    },
                    function (reason) {
                        if (!onrejected) {
                            reject(reason);
                        }
                        else {
                            try {
                                resolve(onrejected(reason));
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                    },
                ]);
                _this._executeHandlers();
            });
        };
        /** JSDoc */
        SyncPromise.prototype.catch = function (onrejected) {
            return this.then(function (val) { return val; }, onrejected);
        };
        /** JSDoc */
        SyncPromise.prototype.finally = function (onfinally) {
            var _this = this;
            return new SyncPromise(function (resolve, reject) {
                var val;
                var isRejected;
                return _this.then(function (value) {
                    isRejected = false;
                    val = value;
                    if (onfinally) {
                        onfinally();
                    }
                }, function (reason) {
                    isRejected = true;
                    val = reason;
                    if (onfinally) {
                        onfinally();
                    }
                }).then(function () {
                    if (isRejected) {
                        reject(val);
                        return;
                    }
                    resolve(val);
                });
            });
        };
        return SyncPromise;
    }());

    /**
     * A TimestampSource implementation for environments that do not support the Performance Web API natively.
     *
     * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
     * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
     * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
     */
    var dateTimestampSource = {
        nowSeconds: function () { return Date.now() / 1000; },
    };
    /**
     * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
     * support the API.
     *
     * Wrapping the native API works around differences in behavior from different browsers.
     */
    function getBrowserPerformance() {
        var performance = getGlobalObject().performance;
        if (!performance || !performance.now) {
            return undefined;
        }
        // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
        //
        // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
        // performance.now() gives a date arbitrarily in the past.
        //
        // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
        // undefined.
        //
        // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
        // interact with data coming out of performance entries.
        //
        // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
        // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
        // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
        // observed skews that can be as long as days, weeks or months.
        //
        // See https://github.com/getsentry/sentry-javascript/issues/2590.
        //
        // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
        // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
        // transactions of long-lived web pages.
        var timeOrigin = Date.now() - performance.now();
        return {
            now: function () { return performance.now(); },
            timeOrigin: timeOrigin,
        };
    }
    /**
     * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
     * implement the API.
     */
    function getNodePerformance() {
        try {
            var perfHooks = dynamicRequire(module, 'perf_hooks');
            return perfHooks.performance;
        }
        catch (_) {
            return undefined;
        }
    }
    /**
     * The Performance API implementation for the current platform, if available.
     */
    var platformPerformance = isNodeEnv() ? getNodePerformance() : getBrowserPerformance();
    var timestampSource = platformPerformance === undefined
        ? dateTimestampSource
        : {
            nowSeconds: function () { return (platformPerformance.timeOrigin + platformPerformance.now()) / 1000; },
        };
    /**
     * Returns a timestamp in seconds since the UNIX epoch using the Date API.
     */
    var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
    /**
     * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
     * availability of the Performance API.
     *
     * See `usingPerformanceAPI` to test whether the Performance API is used.
     *
     * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
     * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
     * skew can grow to arbitrary amounts like days, weeks or months.
     * See https://github.com/getsentry/sentry-javascript/issues/2590.
     */
    var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
    /**
     * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
     * performance API is available.
     */
    ((function () {
        // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
        // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
        // data as reliable if they are within a reasonable threshold of the current time.
        var performance = getGlobalObject().performance;
        if (!performance || !performance.now) {
            return undefined;
        }
        var threshold = 3600 * 1000;
        var performanceNow = performance.now();
        var dateNow = Date.now();
        // if timeOrigin isn't available set delta to threshold so it isn't used
        var timeOriginDelta = performance.timeOrigin
            ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
            : threshold;
        var timeOriginIsReliable = timeOriginDelta < threshold;
        // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
        // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
        // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
        // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
        // Date API.
        // eslint-disable-next-line deprecation/deprecation
        var navigationStart = performance.timing && performance.timing.navigationStart;
        var hasNavigationStart = typeof navigationStart === 'number';
        // if navigationStart isn't available set delta to threshold so it isn't used
        var navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
        var navigationStartIsReliable = navigationStartDelta < threshold;
        if (timeOriginIsReliable || navigationStartIsReliable) {
            // Use the more reliable time origin
            if (timeOriginDelta <= navigationStartDelta) {
                return performance.timeOrigin;
            }
            else {
                return navigationStart;
            }
        }
        return dateNow;
    }))();

    /**
     * Absolute maximum number of breadcrumbs added to an event.
     * The `maxBreadcrumbs` option cannot be higher than this value.
     */
    var MAX_BREADCRUMBS = 100;
    /**
     * Holds additional event information. {@link Scope.applyToEvent} will be
     * called by the client before an event will be sent.
     */
    var Scope = /** @class */ (function () {
        function Scope() {
            /** Flag if notifying is happening. */
            this._notifyingListeners = false;
            /** Callback for client to receive scope changes. */
            this._scopeListeners = [];
            /** Callback list that will be called after {@link applyToEvent}. */
            this._eventProcessors = [];
            /** Array of breadcrumbs. */
            this._breadcrumbs = [];
            /** User */
            this._user = {};
            /** Tags */
            this._tags = {};
            /** Extra */
            this._extra = {};
            /** Contexts */
            this._contexts = {};
            /**
             * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
             * sent to Sentry
             */
            this._sdkProcessingMetadata = {};
        }
        /**
         * Inherit values from the parent scope.
         * @param scope to clone.
         */
        Scope.clone = function (scope) {
            var newScope = new Scope();
            if (scope) {
                newScope._breadcrumbs = __spread(scope._breadcrumbs);
                newScope._tags = __assign({}, scope._tags);
                newScope._extra = __assign({}, scope._extra);
                newScope._contexts = __assign({}, scope._contexts);
                newScope._user = scope._user;
                newScope._level = scope._level;
                newScope._span = scope._span;
                newScope._session = scope._session;
                newScope._transactionName = scope._transactionName;
                newScope._fingerprint = scope._fingerprint;
                newScope._eventProcessors = __spread(scope._eventProcessors);
                newScope._requestSession = scope._requestSession;
            }
            return newScope;
        };
        /**
         * Add internal on change listener. Used for sub SDKs that need to store the scope.
         * @hidden
         */
        Scope.prototype.addScopeListener = function (callback) {
            this._scopeListeners.push(callback);
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.addEventProcessor = function (callback) {
            this._eventProcessors.push(callback);
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setUser = function (user) {
            this._user = user || {};
            if (this._session) {
                this._session.update({ user: user });
            }
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.getUser = function () {
            return this._user;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.getRequestSession = function () {
            return this._requestSession;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setRequestSession = function (requestSession) {
            this._requestSession = requestSession;
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setTags = function (tags) {
            this._tags = __assign(__assign({}, this._tags), tags);
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setTag = function (key, value) {
            var _a;
            this._tags = __assign(__assign({}, this._tags), (_a = {}, _a[key] = value, _a));
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setExtras = function (extras) {
            this._extra = __assign(__assign({}, this._extra), extras);
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setExtra = function (key, extra) {
            var _a;
            this._extra = __assign(__assign({}, this._extra), (_a = {}, _a[key] = extra, _a));
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setFingerprint = function (fingerprint) {
            this._fingerprint = fingerprint;
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setLevel = function (level) {
            this._level = level;
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setTransactionName = function (name) {
            this._transactionName = name;
            this._notifyScopeListeners();
            return this;
        };
        /**
         * Can be removed in major version.
         * @deprecated in favor of {@link this.setTransactionName}
         */
        Scope.prototype.setTransaction = function (name) {
            return this.setTransactionName(name);
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setContext = function (key, context) {
            var _a;
            if (context === null) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this._contexts[key];
            }
            else {
                this._contexts = __assign(__assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
            }
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setSpan = function (span) {
            this._span = span;
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.getSpan = function () {
            return this._span;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.getTransaction = function () {
            // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
            // have a pointer to the currently-active transaction.
            var span = this.getSpan();
            return span && span.transaction;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.setSession = function (session) {
            if (!session) {
                delete this._session;
            }
            else {
                this._session = session;
            }
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.getSession = function () {
            return this._session;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.update = function (captureContext) {
            if (!captureContext) {
                return this;
            }
            if (typeof captureContext === 'function') {
                var updatedScope = captureContext(this);
                return updatedScope instanceof Scope ? updatedScope : this;
            }
            if (captureContext instanceof Scope) {
                this._tags = __assign(__assign({}, this._tags), captureContext._tags);
                this._extra = __assign(__assign({}, this._extra), captureContext._extra);
                this._contexts = __assign(__assign({}, this._contexts), captureContext._contexts);
                if (captureContext._user && Object.keys(captureContext._user).length) {
                    this._user = captureContext._user;
                }
                if (captureContext._level) {
                    this._level = captureContext._level;
                }
                if (captureContext._fingerprint) {
                    this._fingerprint = captureContext._fingerprint;
                }
                if (captureContext._requestSession) {
                    this._requestSession = captureContext._requestSession;
                }
            }
            else if (isPlainObject(captureContext)) {
                // eslint-disable-next-line no-param-reassign
                captureContext = captureContext;
                this._tags = __assign(__assign({}, this._tags), captureContext.tags);
                this._extra = __assign(__assign({}, this._extra), captureContext.extra);
                this._contexts = __assign(__assign({}, this._contexts), captureContext.contexts);
                if (captureContext.user) {
                    this._user = captureContext.user;
                }
                if (captureContext.level) {
                    this._level = captureContext.level;
                }
                if (captureContext.fingerprint) {
                    this._fingerprint = captureContext.fingerprint;
                }
                if (captureContext.requestSession) {
                    this._requestSession = captureContext.requestSession;
                }
            }
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.clear = function () {
            this._breadcrumbs = [];
            this._tags = {};
            this._extra = {};
            this._user = {};
            this._contexts = {};
            this._level = undefined;
            this._transactionName = undefined;
            this._fingerprint = undefined;
            this._requestSession = undefined;
            this._span = undefined;
            this._session = undefined;
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
            var maxCrumbs = typeof maxBreadcrumbs === 'number' ? Math.min(maxBreadcrumbs, MAX_BREADCRUMBS) : MAX_BREADCRUMBS;
            // No data has been changed, so don't notify scope listeners
            if (maxCrumbs <= 0) {
                return this;
            }
            var mergedBreadcrumb = __assign({ timestamp: dateTimestampInSeconds() }, breadcrumb);
            this._breadcrumbs = __spread(this._breadcrumbs, [mergedBreadcrumb]).slice(-maxCrumbs);
            this._notifyScopeListeners();
            return this;
        };
        /**
         * @inheritDoc
         */
        Scope.prototype.clearBreadcrumbs = function () {
            this._breadcrumbs = [];
            this._notifyScopeListeners();
            return this;
        };
        /**
         * Applies the current context and fingerprint to the event.
         * Note that breadcrumbs will be added by the client.
         * Also if the event has already breadcrumbs on it, we do not merge them.
         * @param event Event
         * @param hint May contain additional information about the original exception.
         * @hidden
         */
        Scope.prototype.applyToEvent = function (event, hint) {
            if (this._extra && Object.keys(this._extra).length) {
                event.extra = __assign(__assign({}, this._extra), event.extra);
            }
            if (this._tags && Object.keys(this._tags).length) {
                event.tags = __assign(__assign({}, this._tags), event.tags);
            }
            if (this._user && Object.keys(this._user).length) {
                event.user = __assign(__assign({}, this._user), event.user);
            }
            if (this._contexts && Object.keys(this._contexts).length) {
                event.contexts = __assign(__assign({}, this._contexts), event.contexts);
            }
            if (this._level) {
                event.level = this._level;
            }
            if (this._transactionName) {
                event.transaction = this._transactionName;
            }
            // We want to set the trace context for normal events only if there isn't already
            // a trace context on the event. There is a product feature in place where we link
            // errors with transaction and it relies on that.
            if (this._span) {
                event.contexts = __assign({ trace: this._span.getTraceContext() }, event.contexts);
                var transactionName = this._span.transaction && this._span.transaction.name;
                if (transactionName) {
                    event.tags = __assign({ transaction: transactionName }, event.tags);
                }
            }
            this._applyFingerprint(event);
            event.breadcrumbs = __spread((event.breadcrumbs || []), this._breadcrumbs);
            event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
            event.sdkProcessingMetadata = this._sdkProcessingMetadata;
            return this._notifyEventProcessors(__spread(getGlobalEventProcessors(), this._eventProcessors), event, hint);
        };
        /**
         * Add data which will be accessible during event processing but won't get sent to Sentry
         */
        Scope.prototype.setSDKProcessingMetadata = function (newData) {
            this._sdkProcessingMetadata = __assign(__assign({}, this._sdkProcessingMetadata), newData);
            return this;
        };
        /**
         * This will be called after {@link applyToEvent} is finished.
         */
        Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
            var _this = this;
            if (index === void 0) { index = 0; }
            return new SyncPromise(function (resolve, reject) {
                var processor = processors[index];
                if (event === null || typeof processor !== 'function') {
                    resolve(event);
                }
                else {
                    var result = processor(__assign({}, event), hint);
                    if (isThenable(result)) {
                        void result
                            .then(function (final) { return _this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve); })
                            .then(null, reject);
                    }
                    else {
                        void _this._notifyEventProcessors(processors, result, hint, index + 1)
                            .then(resolve)
                            .then(null, reject);
                    }
                }
            });
        };
        /**
         * This will be called on every set call.
         */
        Scope.prototype._notifyScopeListeners = function () {
            var _this = this;
            // We need this check for this._notifyingListeners to be able to work on scope during updates
            // If this check is not here we'll produce endless recursion when something is done with the scope
            // during the callback.
            if (!this._notifyingListeners) {
                this._notifyingListeners = true;
                this._scopeListeners.forEach(function (callback) {
                    callback(_this);
                });
                this._notifyingListeners = false;
            }
        };
        /**
         * Applies fingerprint from the scope to the event if there's one,
         * uses message if there's one instead or get rid of empty fingerprint
         */
        Scope.prototype._applyFingerprint = function (event) {
            // Make sure it's an array first and we actually have something in place
            event.fingerprint = event.fingerprint
                ? Array.isArray(event.fingerprint)
                    ? event.fingerprint
                    : [event.fingerprint]
                : [];
            // If we have something on the scope, then merge it with event
            if (this._fingerprint) {
                event.fingerprint = event.fingerprint.concat(this._fingerprint);
            }
            // If we have no data at all, remove empty array default
            if (event.fingerprint && !event.fingerprint.length) {
                delete event.fingerprint;
            }
        };
        return Scope;
    }());
    /**
     * Returns the global event processors.
     */
    function getGlobalEventProcessors() {
        return getGlobalSingleton('globalEventProcessors', function () { return []; });
    }

    /**
     * @inheritdoc
     */
    var Session = /** @class */ (function () {
        function Session(context) {
            this.errors = 0;
            this.sid = uuid4();
            this.duration = 0;
            this.status = 'ok';
            this.init = true;
            this.ignoreDuration = false;
            // Both timestamp and started are in seconds since the UNIX epoch.
            var startingTime = timestampInSeconds();
            this.timestamp = startingTime;
            this.started = startingTime;
            if (context) {
                this.update(context);
            }
        }
        /** JSDoc */
        // eslint-disable-next-line complexity
        Session.prototype.update = function (context) {
            if (context === void 0) { context = {}; }
            if (context.user) {
                if (!this.ipAddress && context.user.ip_address) {
                    this.ipAddress = context.user.ip_address;
                }
                if (!this.did && !context.did) {
                    this.did = context.user.id || context.user.email || context.user.username;
                }
            }
            this.timestamp = context.timestamp || timestampInSeconds();
            if (context.ignoreDuration) {
                this.ignoreDuration = context.ignoreDuration;
            }
            if (context.sid) {
                // Good enough uuid validation. — Kamil
                this.sid = context.sid.length === 32 ? context.sid : uuid4();
            }
            if (context.init !== undefined) {
                this.init = context.init;
            }
            if (!this.did && context.did) {
                this.did = "" + context.did;
            }
            if (typeof context.started === 'number') {
                this.started = context.started;
            }
            if (this.ignoreDuration) {
                this.duration = undefined;
            }
            else if (typeof context.duration === 'number') {
                this.duration = context.duration;
            }
            else {
                var duration = this.timestamp - this.started;
                this.duration = duration >= 0 ? duration : 0;
            }
            if (context.release) {
                this.release = context.release;
            }
            if (context.environment) {
                this.environment = context.environment;
            }
            if (!this.ipAddress && context.ipAddress) {
                this.ipAddress = context.ipAddress;
            }
            if (!this.userAgent && context.userAgent) {
                this.userAgent = context.userAgent;
            }
            if (typeof context.errors === 'number') {
                this.errors = context.errors;
            }
            if (context.status) {
                this.status = context.status;
            }
        };
        /** JSDoc */
        Session.prototype.close = function (status) {
            if (status) {
                this.update({ status: status });
            }
            else if (this.status === 'ok') {
                this.update({ status: 'exited' });
            }
            else {
                this.update();
            }
        };
        /** JSDoc */
        Session.prototype.toJSON = function () {
            return dropUndefinedKeys({
                sid: "" + this.sid,
                init: this.init,
                // Make sure that sec is converted to ms for date constructor
                started: new Date(this.started * 1000).toISOString(),
                timestamp: new Date(this.timestamp * 1000).toISOString(),
                status: this.status,
                errors: this.errors,
                did: typeof this.did === 'number' || typeof this.did === 'string' ? "" + this.did : undefined,
                duration: this.duration,
                attrs: {
                    release: this.release,
                    environment: this.environment,
                    ip_address: this.ipAddress,
                    user_agent: this.userAgent,
                },
            });
        };
        return Session;
    }());

    /*
     * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
     * for users.
     *
     * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
     * because some build tools have trouble tree-shaking imported guards.
     *
     * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
     *
     * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
     * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
     * replaced.
     */
    /** Flag that is true for debug builds, false otherwise. */
    var IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;

    /**
     * API compatibility version of this hub.
     *
     * WARNING: This number should only be increased when the global interface
     * changes and new methods are introduced.
     *
     * @hidden
     */
    var API_VERSION = 4;
    /**
     * Default maximum number of breadcrumbs added to an event. Can be overwritten
     * with {@link Options.maxBreadcrumbs}.
     */
    var DEFAULT_BREADCRUMBS = 100;
    /**
     * @inheritDoc
     */
    var Hub = /** @class */ (function () {
        /**
         * Creates a new instance of the hub, will push one {@link Layer} into the
         * internal stack on creation.
         *
         * @param client bound to the hub.
         * @param scope bound to the hub.
         * @param version number, higher number means higher priority.
         */
        function Hub(client, scope, _version) {
            if (scope === void 0) { scope = new Scope(); }
            if (_version === void 0) { _version = API_VERSION; }
            this._version = _version;
            /** Is a {@link Layer}[] containing the client and scope */
            this._stack = [{}];
            this.getStackTop().scope = scope;
            if (client) {
                this.bindClient(client);
            }
        }
        /**
         * @inheritDoc
         */
        Hub.prototype.isOlderThan = function (version) {
            return this._version < version;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.bindClient = function (client) {
            var top = this.getStackTop();
            top.client = client;
            if (client && client.setupIntegrations) {
                client.setupIntegrations();
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.pushScope = function () {
            // We want to clone the content of prev scope
            var scope = Scope.clone(this.getScope());
            this.getStack().push({
                client: this.getClient(),
                scope: scope,
            });
            return scope;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.popScope = function () {
            if (this.getStack().length <= 1)
                return false;
            return !!this.getStack().pop();
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.withScope = function (callback) {
            var scope = this.pushScope();
            try {
                callback(scope);
            }
            finally {
                this.popScope();
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.getClient = function () {
            return this.getStackTop().client;
        };
        /** Returns the scope of the top stack. */
        Hub.prototype.getScope = function () {
            return this.getStackTop().scope;
        };
        /** Returns the scope stack for domains or the process. */
        Hub.prototype.getStack = function () {
            return this._stack;
        };
        /** Returns the topmost scope layer in the order domain > local > process. */
        Hub.prototype.getStackTop = function () {
            return this._stack[this._stack.length - 1];
        };
        /**
         * @inheritDoc
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        Hub.prototype.captureException = function (exception, hint) {
            var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
            var finalHint = hint;
            // If there's no explicit hint provided, mimic the same thing that would happen
            // in the minimal itself to create a consistent behavior.
            // We don't do this in the client, as it's the lowest level API, and doing this,
            // would prevent user from having full control over direct calls.
            if (!hint) {
                var syntheticException = void 0;
                try {
                    throw new Error('Sentry syntheticException');
                }
                catch (exception) {
                    syntheticException = exception;
                }
                finalHint = {
                    originalException: exception,
                    syntheticException: syntheticException,
                };
            }
            this._invokeClient('captureException', exception, __assign(__assign({}, finalHint), { event_id: eventId }));
            return eventId;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.captureMessage = function (message, level, hint) {
            var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
            var finalHint = hint;
            // If there's no explicit hint provided, mimic the same thing that would happen
            // in the minimal itself to create a consistent behavior.
            // We don't do this in the client, as it's the lowest level API, and doing this,
            // would prevent user from having full control over direct calls.
            if (!hint) {
                var syntheticException = void 0;
                try {
                    throw new Error(message);
                }
                catch (exception) {
                    syntheticException = exception;
                }
                finalHint = {
                    originalException: message,
                    syntheticException: syntheticException,
                };
            }
            this._invokeClient('captureMessage', message, level, __assign(__assign({}, finalHint), { event_id: eventId }));
            return eventId;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.captureEvent = function (event, hint) {
            var eventId = hint && hint.event_id ? hint.event_id : uuid4();
            if (event.type !== 'transaction') {
                this._lastEventId = eventId;
            }
            this._invokeClient('captureEvent', event, __assign(__assign({}, hint), { event_id: eventId }));
            return eventId;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.lastEventId = function () {
            return this._lastEventId;
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.addBreadcrumb = function (breadcrumb, hint) {
            var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
            if (!scope || !client)
                return;
            // eslint-disable-next-line @typescript-eslint/unbound-method
            var _b = (client.getOptions && client.getOptions()) || {}, _c = _b.beforeBreadcrumb, beforeBreadcrumb = _c === void 0 ? null : _c, _d = _b.maxBreadcrumbs, maxBreadcrumbs = _d === void 0 ? DEFAULT_BREADCRUMBS : _d;
            if (maxBreadcrumbs <= 0)
                return;
            var timestamp = dateTimestampInSeconds();
            var mergedBreadcrumb = __assign({ timestamp: timestamp }, breadcrumb);
            var finalBreadcrumb = beforeBreadcrumb
                ? consoleSandbox(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
                : mergedBreadcrumb;
            if (finalBreadcrumb === null)
                return;
            scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.setUser = function (user) {
            var scope = this.getScope();
            if (scope)
                scope.setUser(user);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.setTags = function (tags) {
            var scope = this.getScope();
            if (scope)
                scope.setTags(tags);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.setExtras = function (extras) {
            var scope = this.getScope();
            if (scope)
                scope.setExtras(extras);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.setTag = function (key, value) {
            var scope = this.getScope();
            if (scope)
                scope.setTag(key, value);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.setExtra = function (key, extra) {
            var scope = this.getScope();
            if (scope)
                scope.setExtra(key, extra);
        };
        /**
         * @inheritDoc
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Hub.prototype.setContext = function (name, context) {
            var scope = this.getScope();
            if (scope)
                scope.setContext(name, context);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.configureScope = function (callback) {
            var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
            if (scope && client) {
                callback(scope);
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.run = function (callback) {
            var oldHub = makeMain(this);
            try {
                callback(this);
            }
            finally {
                makeMain(oldHub);
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.getIntegration = function (integration) {
            var client = this.getClient();
            if (!client)
                return null;
            try {
                return client.getIntegration(integration);
            }
            catch (_oO) {
                IS_DEBUG_BUILD && logger.warn("Cannot retrieve integration " + integration.id + " from the current Hub");
                return null;
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.startSpan = function (context) {
            return this._callExtensionMethod('startSpan', context);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.startTransaction = function (context, customSamplingContext) {
            return this._callExtensionMethod('startTransaction', context, customSamplingContext);
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.traceHeaders = function () {
            return this._callExtensionMethod('traceHeaders');
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.captureSession = function (endSession) {
            if (endSession === void 0) { endSession = false; }
            // both send the update and pull the session from the scope
            if (endSession) {
                return this.endSession();
            }
            // only send the update
            this._sendSessionUpdate();
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.endSession = function () {
            var layer = this.getStackTop();
            var scope = layer && layer.scope;
            var session = scope && scope.getSession();
            if (session) {
                session.close();
            }
            this._sendSessionUpdate();
            // the session is over; take it off of the scope
            if (scope) {
                scope.setSession();
            }
        };
        /**
         * @inheritDoc
         */
        Hub.prototype.startSession = function (context) {
            var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
            var _b = (client && client.getOptions()) || {}, release = _b.release, environment = _b.environment;
            // Will fetch userAgent if called from browser sdk
            var global = getGlobalObject();
            var userAgent = (global.navigator || {}).userAgent;
            var session = new Session(__assign(__assign(__assign({ release: release,
                environment: environment }, (scope && { user: scope.getUser() })), (userAgent && { userAgent: userAgent })), context));
            if (scope) {
                // End existing session if there's one
                var currentSession = scope.getSession && scope.getSession();
                if (currentSession && currentSession.status === 'ok') {
                    currentSession.update({ status: 'exited' });
                }
                this.endSession();
                // Afterwards we set the new session on the scope
                scope.setSession(session);
            }
            return session;
        };
        /**
         * Sends the current Session on the scope
         */
        Hub.prototype._sendSessionUpdate = function () {
            var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
            if (!scope)
                return;
            var session = scope.getSession && scope.getSession();
            if (session) {
                if (client && client.captureSession) {
                    client.captureSession(session);
                }
            }
        };
        /**
         * Internal helper function to call a method on the top client if it exists.
         *
         * @param method The method to call on the client.
         * @param args Arguments to pass to the client function.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Hub.prototype._invokeClient = function (method) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _b = this.getStackTop(), scope = _b.scope, client = _b.client;
            if (client && client[method]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                (_a = client)[method].apply(_a, __spread(args, [scope]));
            }
        };
        /**
         * Calls global extension method and binding current instance to the function call
         */
        // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Hub.prototype._callExtensionMethod = function (method) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var carrier = getMainCarrier();
            var sentry = carrier.__SENTRY__;
            if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
                return sentry.extensions[method].apply(this, args);
            }
            IS_DEBUG_BUILD && logger.warn("Extension method " + method + " couldn't be found, doing nothing.");
        };
        return Hub;
    }());
    /**
     * Returns the global shim registry.
     *
     * FIXME: This function is problematic, because despite always returning a valid Carrier,
     * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
     * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
     **/
    function getMainCarrier() {
        var carrier = getGlobalObject();
        carrier.__SENTRY__ = carrier.__SENTRY__ || {
            extensions: {},
            hub: undefined,
        };
        return carrier;
    }
    /**
     * Replaces the current main hub with the passed one on the global object
     *
     * @returns The old replaced hub
     */
    function makeMain(hub) {
        var registry = getMainCarrier();
        var oldHub = getHubFromCarrier(registry);
        setHubOnCarrier(registry, hub);
        return oldHub;
    }
    /**
     * Returns the default hub instance.
     *
     * If a hub is already registered in the global carrier but this module
     * contains a more recent version, it replaces the registered version.
     * Otherwise, the currently registered hub will be returned.
     */
    function getCurrentHub() {
        // Get main carrier (global for every environment)
        var registry = getMainCarrier();
        // If there's no hub, or its an old API, assign a new one
        if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
            setHubOnCarrier(registry, new Hub());
        }
        // Prefer domains over global if they are there (applicable only to Node environment)
        if (isNodeEnv()) {
            return getHubFromActiveDomain(registry);
        }
        // Return hub that lives on a global object
        return getHubFromCarrier(registry);
    }
    /**
     * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
     * @returns discovered hub
     */
    function getHubFromActiveDomain(registry) {
        try {
            var sentry = getMainCarrier().__SENTRY__;
            var activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
            // If there's no active domain, just return global hub
            if (!activeDomain) {
                return getHubFromCarrier(registry);
            }
            // If there's no hub on current domain, or it's an old API, assign a new one
            if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
                var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
                setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));
            }
            // Return hub that lives on a domain
            return getHubFromCarrier(activeDomain);
        }
        catch (_Oo) {
            // Return hub that lives on a global object
            return getHubFromCarrier(registry);
        }
    }
    /**
     * This will tell whether a carrier has a hub on it or not
     * @param carrier object
     */
    function hasHubOnCarrier(carrier) {
        return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
    }
    /**
     * This will create a new {@link Hub} and add to the passed object on
     * __SENTRY__.hub.
     * @param carrier object
     * @hidden
     */
    function getHubFromCarrier(carrier) {
        return getGlobalSingleton('hub', function () { return new Hub(); }, carrier);
    }
    /**
     * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
     * @param carrier object
     * @param hub Hub
     * @returns A boolean indicating success or failure
     */
    function setHubOnCarrier(carrier, hub) {
        if (!carrier)
            return false;
        var __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
        __SENTRY__.hub = hub;
        return true;
    }

    /**
     * This calls a function on the current hub.
     * @param method function to call on hub.
     * @param args to pass to function.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function callOnHub(method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var hub = getCurrentHub();
        if (hub && hub[method]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return hub[method].apply(hub, __spread(args));
        }
        throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
    }
    /**
     * Captures a message event and sends it to Sentry.
     *
     * @param message The message to send to Sentry.
     * @param Severity Define the level of the message.
     * @returns The generated eventId.
     */
    function captureMessage(message, captureContext) {
        var syntheticException = new Error(message);
        // This is necessary to provide explicit scopes upgrade, without changing the original
        // arity of the `captureMessage(message, level)` method.
        var level = typeof captureContext === 'string' ? captureContext : undefined;
        var context = typeof captureContext !== 'string' ? { captureContext: captureContext } : undefined;
        return callOnHub('captureMessage', message, level, __assign({ originalException: message, syntheticException: syntheticException }, context));
    }

    exports.captureMessage = captureMessage;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
