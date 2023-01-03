/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/centra/model/CentraResponse.js
var require_CentraResponse = __commonJS({
  "node_modules/centra/model/CentraResponse.js"(exports, module2) {
    module2.exports = class CentraResponse {
      constructor(res, resOptions) {
        this.coreRes = res;
        this.resOptions = resOptions;
        this.body = Buffer.alloc(0);
        this.headers = res.headers;
        this.statusCode = res.statusCode;
      }
      _addChunk(chunk) {
        this.body = Buffer.concat([this.body, chunk]);
      }
      async json() {
        return this.statusCode === 204 ? null : JSON.parse(this.body);
      }
      async text() {
        return this.body.toString();
      }
    };
  }
});

// node_modules/centra/model/CentraRequest.js
var require_CentraRequest = __commonJS({
  "node_modules/centra/model/CentraRequest.js"(exports, module2) {
    var path = require("path");
    var http = require("http");
    var https = require("https");
    var qs = require("querystring");
    var zlib = require("zlib");
    var { URL } = require("url");
    var CentraResponse = require_CentraResponse();
    var supportedCompressions = ["gzip", "deflate", "br"];
    module2.exports = class CentraRequest {
      constructor(url, method = "GET") {
        this.url = typeof url === "string" ? new URL(url) : url;
        this.method = method;
        this.data = null;
        this.sendDataAs = null;
        this.reqHeaders = {};
        this.streamEnabled = false;
        this.compressionEnabled = false;
        this.timeoutTime = null;
        this.coreOptions = {};
        this.resOptions = {
          "maxBuffer": 50 * 1e6
        };
        return this;
      }
      query(a1, a2) {
        if (typeof a1 === "object") {
          Object.keys(a1).forEach((queryKey) => {
            this.url.searchParams.append(queryKey, a1[queryKey]);
          });
        } else
          this.url.searchParams.append(a1, a2);
        return this;
      }
      path(relativePath) {
        this.url.pathname = path.join(this.url.pathname, relativePath);
        return this;
      }
      body(data, sendAs) {
        this.sendDataAs = typeof data === "object" && !sendAs && !Buffer.isBuffer(data) ? "json" : sendAs ? sendAs.toLowerCase() : "buffer";
        this.data = this.sendDataAs === "form" ? qs.stringify(data) : this.sendDataAs === "json" ? JSON.stringify(data) : data;
        return this;
      }
      header(a1, a2) {
        if (typeof a1 === "object") {
          Object.keys(a1).forEach((headerName) => {
            this.reqHeaders[headerName.toLowerCase()] = a1[headerName];
          });
        } else
          this.reqHeaders[a1.toLowerCase()] = a2;
        return this;
      }
      timeout(timeout) {
        this.timeoutTime = timeout;
        return this;
      }
      option(name, value) {
        this.coreOptions[name] = value;
        return this;
      }
      stream() {
        this.streamEnabled = true;
        return this;
      }
      compress() {
        this.compressionEnabled = true;
        if (!this.reqHeaders["accept-encoding"])
          this.reqHeaders["accept-encoding"] = supportedCompressions.join(", ");
        return this;
      }
      send() {
        return new Promise((resolve, reject) => {
          if (this.data) {
            if (!this.reqHeaders.hasOwnProperty("content-type")) {
              if (this.sendDataAs === "json") {
                this.reqHeaders["content-type"] = "application/json";
              } else if (this.sendDataAs === "form") {
                this.reqHeaders["content-type"] = "application/x-www-form-urlencoded";
              }
            }
            if (!this.reqHeaders.hasOwnProperty("content-length")) {
              this.reqHeaders["content-length"] = Buffer.byteLength(this.data);
            }
          }
          const options = Object.assign({
            "protocol": this.url.protocol,
            "host": this.url.hostname.replace("[", "").replace("]", ""),
            "port": this.url.port,
            "path": this.url.pathname + (this.url.search === null ? "" : this.url.search),
            "method": this.method,
            "headers": this.reqHeaders
          }, this.coreOptions);
          let req;
          const resHandler = (res) => {
            let stream = res;
            if (this.compressionEnabled) {
              if (res.headers["content-encoding"] === "gzip") {
                stream = res.pipe(zlib.createGunzip());
              } else if (res.headers["content-encoding"] === "deflate") {
                stream = res.pipe(zlib.createInflate());
              } else if (res.headers["content-encoding"] === "br") {
                stream = res.pipe(zlib.createBrotliDecompress());
              }
            }
            let centraRes;
            if (this.streamEnabled) {
              resolve(stream);
            } else {
              centraRes = new CentraResponse(res, this.resOptions);
              stream.on("error", (err) => {
                reject(err);
              });
              stream.on("aborted", () => {
                reject(new Error("Server aborted request"));
              });
              stream.on("data", (chunk) => {
                centraRes._addChunk(chunk);
                if (this.resOptions.maxBuffer !== null && centraRes.body.length > this.resOptions.maxBuffer) {
                  stream.destroy();
                  reject("Received a response which was longer than acceptable when buffering. (" + this.body.length + " bytes)");
                }
              });
              stream.on("end", () => {
                resolve(centraRes);
              });
            }
          };
          if (this.url.protocol === "http:") {
            req = http.request(options, resHandler);
          } else if (this.url.protocol === "https:") {
            req = https.request(options, resHandler);
          } else
            throw new Error("Bad URL protocol: " + this.url.protocol);
          if (this.timeoutTime) {
            req.setTimeout(this.timeoutTime, () => {
              req.abort();
              if (!this.streamEnabled) {
                reject(new Error("Timeout reached"));
              }
            });
          }
          req.on("error", (err) => {
            reject(err);
          });
          if (this.data)
            req.write(this.data);
          req.end();
        });
      }
    };
  }
});

// node_modules/centra/createRequest.js
var require_createRequest = __commonJS({
  "node_modules/centra/createRequest.js"(exports, module2) {
    var CentraRequest = require_CentraRequest();
    module2.exports = (url, method) => {
      return new CentraRequest(url, method);
    };
  }
});

// node_modules/phin/lib/phin.js
var require_phin = __commonJS({
  "node_modules/phin/lib/phin.js"(exports, module2) {
    var { URL } = require("url");
    var centra = require_createRequest();
    var phin = async (opts) => {
      if (typeof opts !== "string") {
        if (!opts.hasOwnProperty("url")) {
          throw new Error("Missing url option from options for request method.");
        }
      }
      const req = centra(typeof opts === "object" ? opts.url : opts, opts.method || "GET");
      if (opts.headers)
        req.header(opts.headers);
      if (opts.stream)
        req.stream();
      if (opts.timeout)
        req.timeout(opts.timeout);
      if (opts.data)
        req.body(opts.data);
      if (opts.form)
        req.body(opts.form, "form");
      if (opts.compression)
        req.compress();
      if (typeof opts.core === "object") {
        Object.keys(opts.core).forEach((optName) => {
          req.option(optName, opts.core[optName]);
        });
      }
      const res = await req.send();
      if (res.headers.hasOwnProperty("location") && opts.followRedirects) {
        opts.url = new URL(res.headers["location"], opts.url).toString();
        return await phin(opts);
      }
      if (opts.stream) {
        res.stream = res;
        return res;
      } else {
        res.coreRes.body = res.body;
        if (opts.parse) {
          if (opts.parse === "json") {
            res.coreRes.body = await res.json();
            return res.coreRes;
          } else if (opts.parse === "string") {
            res.coreRes.body = res.coreRes.body.toString();
            return res.coreRes;
          }
        }
        return res.coreRes;
      }
    };
    phin.promisified = phin;
    phin.unpromisified = (opts, cb) => {
      phin(opts).then((data) => {
        if (cb)
          cb(null, data);
      }).catch((err) => {
        if (cb)
          cb(err, null);
      });
    };
    phin.defaults = (defaultOpts) => async (opts) => {
      const nops = typeof opts === "string" ? { "url": opts } : opts;
      Object.keys(defaultOpts).forEach((doK) => {
        if (!nops.hasOwnProperty(doK) || nops[doK] === null) {
          nops[doK] = defaultOpts[doK];
        }
      });
      return await phin(nops);
    };
    module2.exports = phin;
  }
});

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => YTranscript
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// transcript-view.ts
var import_obsidian = require("obsidian");

// node_modules/youtube-transcript/dist/youtube-transcript.esm.js
var import_phin = __toESM(require_phin());
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p2 in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p2))
        d2[p2] = b2[p2];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
var RE_YOUTUBE = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/im;
var YoutubeTranscriptError = function(_super) {
  __extends(YoutubeTranscriptError2, _super);
  function YoutubeTranscriptError2(message) {
    return _super.call(this, "[YoutubeTranscript] \u{1F6A8} " + message) || this;
  }
  return YoutubeTranscriptError2;
}(Error);
var YoutubeTranscript = function() {
  function YoutubeTranscript2() {
  }
  YoutubeTranscript2.fetchTranscript = function(videoId, config) {
    return __awaiter(this, void 0, void 0, function() {
      var identifier, videoPageBody, innerTubeApiKey, body, transcripts, e_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            identifier = this.retrieveVideoId(videoId);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4, (0, import_phin.default)("https://www.youtube.com/watch?v=" + identifier)];
          case 2:
            videoPageBody = _a.sent().body;
            innerTubeApiKey = videoPageBody.toString().split('"INNERTUBE_API_KEY":"')[1].split('"')[0];
            if (!(innerTubeApiKey && innerTubeApiKey.length > 0))
              return [3, 4];
            return [4, (0, import_phin.default)({
              url: "https://www.youtube.com/youtubei/v1/get_transcript?key=" + innerTubeApiKey,
              method: "POST",
              data: this.generateRequest(videoPageBody.toString(), config),
              parse: "json"
            })];
          case 3:
            body = _a.sent().body;
            if (body.responseContext) {
              if (!body.actions) {
                throw new Error("Transcript is disabled on this video");
              }
              transcripts = body.actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups;
              return [2, transcripts.map(function(cue) {
                return {
                  text: cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.cue.simpleText,
                  duration: parseInt(cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.durationMs),
                  offset: parseInt(cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.startOffsetMs)
                };
              })];
            }
            _a.label = 4;
          case 4:
            return [3, 6];
          case 5:
            e_1 = _a.sent();
            throw new YoutubeTranscriptError(e_1);
          case 6:
            return [2];
        }
      });
    });
  };
  YoutubeTranscript2.generateRequest = function(page, config) {
    var _a, _b, _c, _d;
    var params = (_a = page.split('"serializedShareEntity":"')[1]) === null || _a === void 0 ? void 0 : _a.split('"')[0];
    var visitorData = (_b = page.split('"VISITOR_DATA":"')[1]) === null || _b === void 0 ? void 0 : _b.split('"')[0];
    var sessionId = (_c = page.split('"sessionId":"')[1]) === null || _c === void 0 ? void 0 : _c.split('"')[0];
    var clickTrackingParams = (_d = page === null || page === void 0 ? void 0 : page.split('"clickTrackingParams":"')[1]) === null || _d === void 0 ? void 0 : _d.split('"')[0];
    return {
      context: {
        client: {
          hl: (config === null || config === void 0 ? void 0 : config.lang) || "fr",
          gl: (config === null || config === void 0 ? void 0 : config.country) || "FR",
          visitorData,
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
          clientName: "WEB",
          clientVersion: "2.20200925.01.00",
          osName: "Macintosh",
          osVersion: "10_15_4",
          browserName: "Chrome",
          browserVersion: "85.0f.4183.83",
          screenWidthPoints: 1440,
          screenHeightPoints: 770,
          screenPixelDensity: 2,
          utcOffsetMinutes: 120,
          userInterfaceTheme: "USER_INTERFACE_THEME_LIGHT",
          connectionType: "CONN_CELLULAR_3G"
        },
        request: {
          sessionId,
          internalExperimentFlags: [],
          consistencyTokenJars: []
        },
        user: {},
        clientScreenNonce: this.generateNonce(),
        clickTracking: {
          clickTrackingParams
        }
      },
      params
    };
  };
  YoutubeTranscript2.generateNonce = function() {
    var rnd = Math.random().toString();
    var alphabet = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghjijklmnopqrstuvwxyz0123456789";
    var jda = [
      alphabet + "+/=",
      alphabet + "+/",
      alphabet + "-_=",
      alphabet + "-_.",
      alphabet + "-_"
    ];
    var b = jda[3];
    var a = [];
    for (var i = 0; i < rnd.length - 1; i++) {
      a.push(rnd[i].charCodeAt(i));
    }
    var c = "";
    var d = 0;
    var m, n, q, r, f, g;
    while (d < a.length) {
      f = a[d];
      g = d + 1 < a.length;
      if (g) {
        m = a[d + 1];
      } else {
        m = 0;
      }
      n = d + 2 < a.length;
      if (n) {
        q = a[d + 2];
      } else {
        q = 0;
      }
      r = f >> 2;
      f = (f & 3) << 4 | m >> 4;
      m = (m & 15) << 2 | q >> 6;
      q &= 63;
      if (!n) {
        q = 64;
        if (!q) {
          m = 64;
        }
      }
      c += b[r] + b[f] + b[m] + b[q];
      d += 3;
    }
    return c;
  };
  YoutubeTranscript2.retrieveVideoId = function(videoId) {
    if (videoId.length === 11) {
      return videoId;
    }
    var matchId = RE_YOUTUBE.exec(videoId);
    if (matchId && matchId.length) {
      return matchId[1];
    }
    throw new YoutubeTranscriptError("Impossible to retrieve Youtube video ID.");
  };
  return YoutubeTranscript2;
}();
var youtube_transcript_esm_default = YoutubeTranscript;

// transcript-view.ts
var TRANSCRIPT_TYPE_VIEW = "transcript-view";
var formatTimestamp = (t) => {
  const fnum = (n) => n && n < 10 ? "0" + n.toFixed() : n.toFixed();
  const h = 3600 * 1e3;
  const hours = Math.floor(t / h);
  const m = 60 * 1e3;
  const minutes = Math.floor((t - hours * h) / m);
  const ms = 1e3;
  const seconds = Math.floor((t - minutes * m) / ms);
  const time = hours ? [hours, minutes, seconds] : [minutes, seconds];
  return time.map(fnum).join(":");
};
var TranscriptView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return TRANSCRIPT_TYPE_VIEW;
  }
  getDisplayText() {
    return "Transcript";
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h4", { text: "Transcript" });
  }
  setEphemeralState({ url }) {
    youtube_transcript_esm_default.fetchTranscript(url).then((data) => {
      var div = createEl("div");
      data.forEach((line, i) => {
        if (i % 32 == 0) {
          div = createEl("div");
          const button = createEl("button", { cls: "timestamp", attr: { "data-timestamp": line.offset.toFixed() } });
          button.innerText = formatTimestamp(line.offset);
          const span = this.contentEl.createEl("span", { cls: "transcript-line", text: line.text + " " });
          div.appendChild(button);
          div.appendChild(span);
          this.contentEl.appendChild(div);
        } else {
          const span = this.contentEl.createEl("span", { cls: "transcript-line", text: line.text + " " });
          div.appendChild(span);
        }
      });
    });
  }
};

// main.ts
var YTranscript = class extends import_obsidian2.Plugin {
  async onload() {
    this.registerView(TRANSCRIPT_TYPE_VIEW, (leaf) => new TranscriptView(leaf));
    this.addCommand({
      id: "fetch-transcript",
      name: "Fetch transcription",
      editorCallback: (editor, view) => {
        const url = editor.getSelection().trim();
        this.openView(url);
      }
    });
  }
  async openView(url) {
    const leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({
      type: TRANSCRIPT_TYPE_VIEW
    });
    this.app.workspace.revealLeaf(leaf);
    leaf.setEphemeralState({
      url
    });
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(TRANSCRIPT_TYPE_VIEW);
  }
};
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