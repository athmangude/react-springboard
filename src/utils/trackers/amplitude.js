/* eslint-disable */

export default function amplitudeTracker(API_KEY) {
  (function (e, t) {
    const n = e.amplitude || { _q: [], _iq: {} }; const r = t.createElement('script')
    ;r.type = 'text/javascript'; r.async = true
    ;r.src = 'https://cdn.amplitude.com/libs/amplitude-4.4.0-min.gz.js'
    ;r.onload = function () {
      if (e.amplitude.runQueuedFunctions) {
        e.amplitude.runQueuedFunctions();
      } else {
        console.log('[Amplitude] Error: could not load SDK');
      }
    }

    ;const i = t.getElementsByTagName('script')[0]; i.parentNode.insertBefore(r, i)
    ;function s(e, t) {
      e.prototype[t] = function () {
        this._q.push([t].concat(Array.prototype.slice.call(arguments, 0))); return this;
      };
    }
    const o = function () { this._q = []; return this; }
    ;const a = ['add', 'append', 'clearAll', 'prepend', 'set', 'setOnce', 'unset']
    ;for (let u = 0; u < a.length; u++) { s(o, a[u]); }n.Identify = o; const c = function () {
      this._q = []
    ;return this;
    }
    ;const l = ['setProductId', 'setQuantity', 'setPrice', 'setRevenueType', 'setEventProperties']
    ;for (let p = 0; p < l.length; p++) { s(c, l[p]); }n.Revenue = c
    ;const d = ['init', 'logEvent', 'logRevenue', 'setUserId', 'setUserProperties', 'setOptOut', 'setVersionName', 'setDomain', 'setDeviceId', 'setGlobalUserProperties', 'identify', 'clearUserProperties', 'setGroup', 'logRevenueV2', 'regenerateDeviceId', 'logEventWithTimestamp', 'logEventWithGroups', 'setSessionId', 'resetSessionId']
    ;function v(e) {
      function t(t) {
        e[t] = function () {
          e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      for (let n = 0; n < d.length; n++) { t(d[n]); }
    }v(n); n.getInstance = function (e) {
      e = (!e || e.length === 0 ? '$default_instance' : e).toLowerCase()
    ;if (!n._iq.hasOwnProperty(e)) { n._iq[e] = { _q: [] }; v(n._iq[e]); } return n._iq[e];
    }
    ;e.amplitude = n;
  }(window, document));
}
