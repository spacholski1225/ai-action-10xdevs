//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function.");
});

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
/**
* https://stackoverflow.com/a/2117523
*/
let uuid4 = function() {
	const { crypto: crypto$1 } = globalThis;
	if (crypto$1?.randomUUID) {
		uuid4 = crypto$1.randomUUID.bind(crypto$1);
		return crypto$1.randomUUID();
	}
	const u8 = new Uint8Array(1);
	const randomByte = crypto$1 ? () => crypto$1.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
const castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (err.cause && !error.cause) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/core/error.mjs
var AnthropicError = class extends Error {};
var APIError = class APIError extends AnthropicError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.requestID = headers?.get("request-id");
		this.error = error;
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse;
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
/** Returns an object if the given value isn't an object, otherwise returns as-is */
function maybeObj(x) {
	if (typeof x !== "object") return {};
	return x ?? {};
}
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
const validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new AnthropicError(`${name} must be an integer`);
	if (n < 0) throw new AnthropicError(`${name} must be a positive integer`);
	return n;
};
const safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return void 0;
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
const levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return void 0;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
	return void 0;
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
	if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger[fnLevel].bind(logger);
}
const noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
let cachedLoggers = new WeakMap();
function loggerFor(client) {
	const logger = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger, logLevel),
		warn: makeLogFn("warn", logger, logLevel),
		info: makeLogFn("info", logger, logLevel),
		debug: makeLogFn("debug", logger, logLevel)
	};
	cachedLoggers.set(logger, [logLevel, levelLogger]);
	return levelLogger;
}
const formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
	}
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, name.toLowerCase() === "x-api-key" || name.toLowerCase() === "authorization" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/version.mjs
const VERSION = "0.51.0";

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
const isRunningInBrowser = () => {
	return typeof window !== "undefined" && typeof window.document !== "undefined" && typeof navigator !== "undefined";
};
/**
* Note this does not detect 'browser'; for that, use getBrowserInfo().
*/
function getDetectedPlatform() {
	if (typeof Deno !== "undefined" && Deno.build != null) return "deno";
	if (typeof EdgeRuntime !== "undefined") return "edge";
	if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") return "node";
	return "unknown";
}
const getPlatformProperties = () => {
	const detectedPlatform = getDetectedPlatform();
	if (detectedPlatform === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(Deno.build.os),
		"X-Stainless-Arch": normalizeArch(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime !== "undefined") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	if (detectedPlatform === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(globalThis.process.platform),
		"X-Stainless-Arch": normalizeArch(globalThis.process.arch),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	const browserInfo = getBrowserInfo();
	if (browserInfo) return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${browserInfo.browser}`,
		"X-Stainless-Runtime-Version": browserInfo.version
	};
	return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function getBrowserInfo() {
	if (typeof navigator === "undefined" || !navigator) return null;
	const browserPatterns = [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	];
	for (const { key, pattern } of browserPatterns) {
		const match = pattern.exec(navigator.userAgent);
		if (match) {
			const major = match[1] || 0;
			const minor = match[2] || 0;
			const patch = match[3] || 0;
			return {
				browser: key,
				version: `${major}.${minor}.${patch}`
			};
		}
	}
	return null;
}
const normalizeArch = (arch) => {
	if (arch === "x32") return "x32";
	if (arch === "x86_64" || arch === "x64") return "x64";
	if (arch === "arm") return "arm";
	if (arch === "aarch64" || arch === "arm64") return "arm64";
	if (arch) return `other:${arch}`;
	return "unknown";
};
const normalizePlatform = (platform) => {
	platform = platform.toLowerCase();
	if (platform.includes("ios")) return "iOS";
	if (platform === "android") return "Android";
	if (platform === "darwin") return "MacOS";
	if (platform === "win32") return "Windows";
	if (platform === "freebsd") return "FreeBSD";
	if (platform === "openbsd") return "OpenBSD";
	if (platform === "linux") return "Linux";
	if (platform) return `Other:${platform}`;
	return "Unknown";
};
let _platformHeaders;
const getPlatformHeaders = () => {
	return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/shims.mjs
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Most browsers don't yet have async iterable support for ReadableStream,
* and Node has a very different way of reading bytes from its "ReadableStream".
*
* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
*/
function ReadableStreamToAsyncIterable(stream) {
	if (stream[Symbol.asyncIterator]) return stream;
	const reader = stream.getReader();
	return {
		async next() {
			try {
				const result = await reader.read();
				if (result?.done) reader.releaseLock();
				return result;
			} catch (e) {
				reader.releaseLock();
				throw e;
			}
		},
		async return() {
			const cancelPromise = reader.cancel();
			reader.releaseLock();
			await cancelPromise;
			return {
				done: true,
				value: void 0
			};
		},
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/request-options.mjs
const FallbackEncoder = ({ headers, body }) => {
	return {
		bodyHeaders: { "content-type": "application/json" },
		body: JSON.stringify(body)
	};
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function concatBytes(buffers) {
	let length = 0;
	for (const buffer of buffers) length += buffer.length;
	const output = new Uint8Array(length);
	let index = 0;
	for (const buffer of buffers) {
		output.set(buffer, index);
		index += buffer.length;
	}
	return output;
}
let encodeUTF8_;
function encodeUTF8(str) {
	let encoder;
	return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
}
let decodeUTF8_;
function decodeUTF8(bytes) {
	let decoder;
	return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var _LineDecoder_buffer, _LineDecoder_carriageReturnIndex;
/**
* A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
* reading lines from text.
*
* https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
*/
var LineDecoder = class {
	constructor() {
		_LineDecoder_buffer.set(this, void 0);
		_LineDecoder_carriageReturnIndex.set(this, void 0);
		__classPrivateFieldSet(this, _LineDecoder_buffer, new Uint8Array(), "f");
		__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
	}
	decode(chunk) {
		if (chunk == null) return [];
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		__classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
		const lines = [];
		let patternIndex;
		while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
			if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
				continue;
			}
			if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
				lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
				__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
				continue;
			}
			const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
			const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
			lines.push(line);
			__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
			__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
		}
		return lines;
	}
	flush() {
		if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) return [];
		return this.decode("\n");
	}
};
_LineDecoder_buffer = new WeakMap(), _LineDecoder_carriageReturnIndex = new WeakMap();
LineDecoder.NEWLINE_CHARS = new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
* This function searches the buffer for the end patterns, (\r or \n)
* and returns an object with the index preceding the matched newline and the
* index after the newline char. `null` is returned if no new line is found.
*
* ```ts
* findNewLineIndex('abc\ndef') -> { preceding: 2, index: 3 }
* ```
*/
function findNewlineIndex(buffer, startIndex) {
	const newline = 10;
	const carriage = 13;
	for (let i = startIndex ?? 0; i < buffer.length; i++) {
		if (buffer[i] === newline) return {
			preceding: i,
			index: i + 1,
			carriage: false
		};
		if (buffer[i] === carriage) return {
			preceding: i,
			index: i + 1,
			carriage: true
		};
	}
	return null;
}
function findDoubleNewlineIndex(buffer) {
	const newline = 10;
	const carriage = 13;
	for (let i = 0; i < buffer.length - 1; i++) {
		if (buffer[i] === newline && buffer[i + 1] === newline) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === carriage) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) return i + 4;
	}
	return -1;
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/core/streaming.mjs
var Stream = class Stream {
	constructor(iterator, controller) {
		this.iterator = iterator;
		this.controller = controller;
	}
	static fromSSEResponse(response, controller) {
		let consumed = false;
		async function* iterator() {
			if (consumed) throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const sse of _iterSSEMessages(response, controller)) {
					if (sse.event === "completion") try {
						yield JSON.parse(sse.data);
					} catch (e) {
						console.error(`Could not parse message into JSON:`, sse.data);
						console.error(`From chunk:`, sse.raw);
						throw e;
					}
					if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop") try {
						yield JSON.parse(sse.data);
					} catch (e) {
						console.error(`Could not parse message into JSON:`, sse.data);
						console.error(`From chunk:`, sse.raw);
						throw e;
					}
					if (sse.event === "ping") continue;
					if (sse.event === "error") throw new APIError(void 0, safeJSON(sse.data) ?? sse.data, void 0, response.headers);
				}
				done = true;
			} catch (e) {
				if (isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller);
	}
	/**
	* Generates a Stream from a newline-separated ReadableStream
	* where each item is a JSON value.
	*/
	static fromReadableStream(readableStream, controller) {
		let consumed = false;
		async function* iterLines() {
			const lineDecoder = new LineDecoder();
			const iter = ReadableStreamToAsyncIterable(readableStream);
			for await (const chunk of iter) for (const line of lineDecoder.decode(chunk)) yield line;
			for (const line of lineDecoder.flush()) yield line;
		}
		async function* iterator() {
			if (consumed) throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const line of iterLines()) {
					if (done) continue;
					if (line) yield JSON.parse(line);
				}
				done = true;
			} catch (e) {
				if (isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller);
	}
	[Symbol.asyncIterator]() {
		return this.iterator();
	}
	/**
	* Splits the stream into two streams which can be
	* independently read from at different speeds.
	*/
	tee() {
		const left = [];
		const right = [];
		const iterator = this.iterator();
		const teeIterator = (queue) => {
			return { next: () => {
				if (queue.length === 0) {
					const result = iterator.next();
					left.push(result);
					right.push(result);
				}
				return queue.shift();
			} };
		};
		return [new Stream(() => teeIterator(left), this.controller), new Stream(() => teeIterator(right), this.controller)];
	}
	/**
	* Converts this stream to a newline-separated ReadableStream of
	* JSON stringified values in the stream
	* which can be turned back into a Stream with `Stream.fromReadableStream()`.
	*/
	toReadableStream() {
		const self = this;
		let iter;
		return makeReadableStream({
			async start() {
				iter = self[Symbol.asyncIterator]();
			},
			async pull(ctrl) {
				try {
					const { value, done } = await iter.next();
					if (done) return ctrl.close();
					const bytes = encodeUTF8(JSON.stringify(value) + "\n");
					ctrl.enqueue(bytes);
				} catch (err) {
					ctrl.error(err);
				}
			},
			async cancel() {
				await iter.return?.();
			}
		});
	}
};
async function* _iterSSEMessages(response, controller) {
	if (!response.body) {
		controller.abort();
		if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
		throw new AnthropicError(`Attempted to iterate over a response with no body`);
	}
	const sseDecoder = new SSEDecoder();
	const lineDecoder = new LineDecoder();
	const iter = ReadableStreamToAsyncIterable(response.body);
	for await (const sseChunk of iterSSEChunks(iter)) for (const line of lineDecoder.decode(sseChunk)) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
	for (const line of lineDecoder.flush()) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
}
/**
* Given an async iterable iterator, iterates over it and yields full
* SSE chunks, i.e. yields when a double new-line is encountered.
*/
async function* iterSSEChunks(iterator) {
	let data = new Uint8Array();
	for await (const chunk of iterator) {
		if (chunk == null) continue;
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		let newData = new Uint8Array(data.length + binaryChunk.length);
		newData.set(data);
		newData.set(binaryChunk, data.length);
		data = newData;
		let patternIndex;
		while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
			yield data.slice(0, patternIndex);
			data = data.slice(patternIndex);
		}
	}
	if (data.length > 0) yield data;
}
var SSEDecoder = class {
	constructor() {
		this.event = null;
		this.data = [];
		this.chunks = [];
	}
	decode(line) {
		if (line.endsWith("\r")) line = line.substring(0, line.length - 1);
		if (!line) {
			if (!this.event && !this.data.length) return null;
			const sse = {
				event: this.event,
				data: this.data.join("\n"),
				raw: this.chunks
			};
			this.event = null;
			this.data = [];
			this.chunks = [];
			return sse;
		}
		this.chunks.push(line);
		if (line.startsWith(":")) return null;
		let [fieldname, _, value] = partition(line, ":");
		if (value.startsWith(" ")) value = value.substring(1);
		if (fieldname === "event") this.event = value;
		else if (fieldname === "data") this.data.push(value);
		return null;
	}
};
function partition(str, delimiter) {
	const index = str.indexOf(delimiter);
	if (index !== -1) return [
		str.substring(0, index),
		delimiter,
		str.substring(index + delimiter.length)
	];
	return [
		str,
		"",
		""
	];
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function defaultParseResponse(client, props) {
	const { response, requestLogID, retryOfRequestLogID, startTime } = props;
	const body = await (async () => {
		if (props.options.stream) {
			loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
			if (props.options.__streamClass) return props.options.__streamClass.fromSSEResponse(response, props.controller);
			return Stream.fromSSEResponse(response, props.controller);
		}
		if (response.status === 204) return null;
		if (props.options.__binaryResponse) return response;
		const contentType = response.headers.get("content-type");
		const mediaType = contentType?.split(";")[0]?.trim();
		const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
		if (isJSON) {
			const json = await response.json();
			return addRequestID(json, response);
		}
		const text = await response.text();
		return text;
	})();
	loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
		retryOfRequestLogID,
		url: response.url,
		status: response.status,
		body,
		durationMs: Date.now() - startTime
	}));
	return body;
}
function addRequestID(value, response) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return Object.defineProperty(value, "_request_id", {
		value: response.headers.get("request-id"),
		enumerable: false
	});
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var _APIPromise_client;
/**
* A subclass of `Promise` providing additional helper methods
* for interacting with the SDK.
*/
var APIPromise = class APIPromise extends Promise {
	constructor(client, responsePromise, parseResponse = defaultParseResponse) {
		super((resolve) => {
			resolve(null);
		});
		this.responsePromise = responsePromise;
		this.parseResponse = parseResponse;
		_APIPromise_client.set(this, void 0);
		__classPrivateFieldSet(this, _APIPromise_client, client, "f");
	}
	_thenUnwrap(transform) {
		return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
	}
	/**
	* Gets the raw `Response` instance instead of parsing the response
	* data.
	*
	* If you want to parse the response body but still get the `Response`
	* instance, you can use {@link withResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	asResponse() {
		return this.responsePromise.then((p) => p.response);
	}
	/**
	* Gets the parsed response data, the raw `Response` instance and the ID of the request,
	* returned via the `request-id` header which is useful for debugging requests and resporting
	* issues to Anthropic.
	*
	* If you just want to get the raw `Response` instance without parsing it,
	* you can use {@link asResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	async withResponse() {
		const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
		return {
			data,
			response,
			request_id: response.headers.get("request-id")
		};
	}
	parse() {
		if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
		return this.parsedPromise;
	}
	then(onfulfilled, onrejected) {
		return this.parse().then(onfulfilled, onrejected);
	}
	catch(onrejected) {
		return this.parse().catch(onrejected);
	}
	finally(onfinally) {
		return this.parse().finally(onfinally);
	}
};
_APIPromise_client = new WeakMap();

//#endregion
//#region node_modules/@anthropic-ai/sdk/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
	constructor(client, response, body, options) {
		_AbstractPage_client.set(this, void 0);
		__classPrivateFieldSet(this, _AbstractPage_client, client, "f");
		this.options = options;
		this.response = response;
		this.body = body;
	}
	hasNextPage() {
		const items = this.getPaginatedItems();
		if (!items.length) return false;
		return this.nextPageRequestOptions() != null;
	}
	async getNextPage() {
		const nextOptions = this.nextPageRequestOptions();
		if (!nextOptions) throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
		return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
	}
	async *iterPages() {
		let page = this;
		yield page;
		while (page.hasNextPage()) {
			page = await page.getNextPage();
			yield page;
		}
	}
	async *[(_AbstractPage_client = new WeakMap(), Symbol.asyncIterator)]() {
		for await (const page of this.iterPages()) for (const item of page.getPaginatedItems()) yield item;
	}
};
/**
* This subclass of Promise will resolve to an instantiated Page once the request completes.
*
* It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
*
*    for await (const item of client.items.list()) {
*      console.log(item)
*    }
*/
var PagePromise = class extends APIPromise {
	constructor(client, request, Page$1) {
		super(client, request, async (client$1, props) => new Page$1(client$1, props.response, await defaultParseResponse(client$1, props), props.options));
	}
	/**
	* Allow auto-paginating iteration on an unawaited list call, eg:
	*
	*    for await (const item of client.items.list()) {
	*      console.log(item)
	*    }
	*/
	async *[Symbol.asyncIterator]() {
		const page = await this;
		for await (const item of page) yield item;
	}
};
var Page = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
		this.first_id = body.first_id || null;
		this.last_id = body.last_id || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		if (this.options.query?.["before_id"]) {
			const first_id = this.first_id;
			if (!first_id) return null;
			return {
				...this.options,
				query: {
					...maybeObj(this.options.query),
					before_id: first_id
				}
			};
		}
		const cursor = this.last_id;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after_id: cursor
			}
		};
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/uploads.mjs
const checkFileSupport = () => {
	if (typeof File === "undefined") {
		const { process: process$1 } = globalThis;
		const isOldNode = typeof process$1?.versions?.node === "string" && parseInt(process$1.versions.node.split(".")) < 20;
		throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
/**
* Construct a `File` instance. This is used to ensure a helpful error is thrown
* for environments that don't define a global `File` yet.
*/
function makeFile(fileBits, fileName, options) {
	checkFileSupport();
	return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
	return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
const isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/to-file.mjs
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
const isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
/**
* Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
* @param value the raw content of the file.  Can be an {@link Uploadable}, {@link BlobLikePart}, or {@link AsyncIterable} of {@link BlobLikePart}s
* @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
* @param {Object=} options additional properties
* @param {string=} options.type the MIME type of the content
* @param {number=} options.lastModified the last modified timestamp
* @returns a {@link File} with the given properties
*/
async function toFile(value, name, options) {
	checkFileSupport();
	value = await value;
	if (isFileLike(value)) {
		if (value instanceof File) return value;
		return makeFile([await value.arrayBuffer()], value.name);
	}
	if (isResponseLike(value)) {
		const blob = await value.blob();
		name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
		return makeFile(await getBytes(blob), name, options);
	}
	const parts = await getBytes(value);
	name || (name = getName(value));
	if (!options?.type) {
		const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
		if (typeof type === "string") options = {
			...options,
			type
		};
	}
	return makeFile(parts, name, options);
}
async function getBytes(value) {
	let parts = [];
	if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
	else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
	else if (isAsyncIterable(value)) for await (const chunk of value) parts.push(...await getBytes(chunk));
	else {
		const constructor = value?.constructor?.name;
		throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
	}
	return parts;
}
function propsForError(value) {
	if (typeof value !== "object" || value === null) return "";
	const props = Object.getOwnPropertyNames(value);
	return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
}

//#endregion
//#region node_modules/@anthropic-ai/sdk/core/resource.mjs
var APIResource = class {
	constructor(client) {
		this._client = client;
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/headers.mjs
const brand_privateNullableHeaders = Symbol.for("brand.privateNullableHeaders");
const isArray = Array.isArray;
function* iterateHeaders(headers) {
	if (!headers) return;
	if (brand_privateNullableHeaders in headers) {
		const { values, nulls } = headers;
		yield* values.entries();
		for (const name of nulls) yield [name, null];
		return;
	}
	let shouldClear = false;
	let iter;
	if (headers instanceof Headers) iter = headers.entries();
	else if (isArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (let row of iter) {
		const name = row[0];
		if (typeof name !== "string") throw new TypeError("expected header name to be a string");
		const values = isArray(row[1]) ? row[1] : [row[1]];
		let didClear = false;
		for (const value of values) {
			if (value === void 0) continue;
			if (shouldClear && !didClear) {
				didClear = true;
				yield [name, null];
			}
			yield [name, value];
		}
	}
}
const buildHeaders = (newHeaders) => {
	const targetHeaders = new Headers();
	const nullHeaders = new Set();
	for (const headers of newHeaders) {
		const seenHeaders = new Set();
		for (const [name, value] of iterateHeaders(headers)) {
			const lowerName = name.toLowerCase();
			if (!seenHeaders.has(lowerName)) {
				targetHeaders.delete(name);
				seenHeaders.add(lowerName);
			}
			if (value === null) {
				targetHeaders.delete(name);
				nullHeaders.add(lowerName);
			} else {
				targetHeaders.append(name, value);
				nullHeaders.delete(lowerName);
			}
		}
	}
	return {
		[brand_privateNullableHeaders]: true,
		values: targetHeaders,
		nulls: nullHeaders
	};
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
/**
* Percent-encode everything that isn't safe to have in a path without encoding safe chars.
*
* Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
* > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
* > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
* > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
*/
function encodeURIPath(str) {
	return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const createPathTagFunction = (pathEncoder = encodeURIPath) => function path$2(statics, ...params) {
	if (statics.length === 1) return statics[0];
	let postPath = false;
	const path$3 = statics.reduce((previousValue, currentValue, index) => {
		if (/[?#]/.test(currentValue)) postPath = true;
		return previousValue + currentValue + (index === params.length ? "" : (postPath ? encodeURIComponent : pathEncoder)(String(params[index])));
	}, "");
	const pathOnly = path$3.split(/[?#]/, 1)[0];
	const invalidSegments = [];
	const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
	let match;
	while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) invalidSegments.push({
		start: match.index,
		length: match[0].length
	});
	if (invalidSegments.length > 0) {
		let lastEnd = 0;
		const underline = invalidSegments.reduce((acc, segment) => {
			const spaces = " ".repeat(segment.start - lastEnd);
			const arrows = "^".repeat(segment.length);
			lastEnd = segment.start + segment.length;
			return acc + spaces + arrows;
		}, "");
		throw new AnthropicError(`Path parameters result in path with invalid segments:\n${path$3}\n${underline}`);
	}
	return path$3;
};
/**
* URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
*/
const path$1 = createPathTagFunction(encodeURIPath);

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var Models$1 = class extends APIResource {
	/**
	* Get a specific model.
	*
	* The Models API response can be used to determine information about a specific
	* model or resolve a model alias to a model ID.
	*
	* @example
	* ```ts
	* const betaModelInfo = await client.beta.models.retrieve(
	*   'model_id',
	* );
	* ```
	*/
	retrieve(modelID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.get(path$1`/v1/models/${modelID}?beta=true`, {
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers])
		});
	}
	/**
	* List available models.
	*
	* The Models API response can be used to determine which models are available for
	* use in the API. More recently released models are listed first.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const betaModelInfo of client.beta.models.list()) {
	*   // ...
	* }
	* ```
	*/
	list(params = {}, options) {
		const { betas,...query } = params ?? {};
		return this._client.getAPIList("/v1/models?beta=true", Page, {
			query,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers])
		});
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var JSONLDecoder = class JSONLDecoder {
	constructor(iterator, controller) {
		this.iterator = iterator;
		this.controller = controller;
	}
	async *decoder() {
		const lineDecoder = new LineDecoder();
		for await (const chunk of this.iterator) for (const line of lineDecoder.decode(chunk)) yield JSON.parse(line);
		for (const line of lineDecoder.flush()) yield JSON.parse(line);
	}
	[Symbol.asyncIterator]() {
		return this.decoder();
	}
	static fromResponse(response, controller) {
		if (!response.body) {
			controller.abort();
			if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
			throw new AnthropicError(`Attempted to iterate over a response with no body`);
		}
		return new JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller);
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches$1 = class extends APIResource {
	/**
	* Send a batch of Message creation requests.
	*
	* The Message Batches API can be used to process multiple Messages API requests at
	* once. Once a Message Batch is created, it begins processing immediately. Batches
	* can take up to 24 hours to complete.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const betaMessageBatch =
	*   await client.beta.messages.batches.create({
	*     requests: [
	*       {
	*         custom_id: 'my-custom-id-1',
	*         params: {
	*           max_tokens: 1024,
	*           messages: [
	*             { content: 'Hello, world', role: 'user' },
	*           ],
	*           model: 'claude-3-7-sonnet-20250219',
	*         },
	*       },
	*     ],
	*   });
	* ```
	*/
	create(params, options) {
		const { betas,...body } = params;
		return this._client.post("/v1/messages/batches?beta=true", {
			body,
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() }, options?.headers])
		});
	}
	/**
	* This endpoint is idempotent and can be used to poll for Message Batch
	* completion. To access the results of a Message Batch, make a request to the
	* `results_url` field in the response.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const betaMessageBatch =
	*   await client.beta.messages.batches.retrieve(
	*     'message_batch_id',
	*   );
	* ```
	*/
	retrieve(messageBatchID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.get(path$1`/v1/messages/batches/${messageBatchID}?beta=true`, {
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() }, options?.headers])
		});
	}
	/**
	* List all Message Batches within a Workspace. Most recently created batches are
	* returned first.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const betaMessageBatch of client.beta.messages.batches.list()) {
	*   // ...
	* }
	* ```
	*/
	list(params = {}, options) {
		const { betas,...query } = params ?? {};
		return this._client.getAPIList("/v1/messages/batches?beta=true", Page, {
			query,
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() }, options?.headers])
		});
	}
	/**
	* Delete a Message Batch.
	*
	* Message Batches can only be deleted once they've finished processing. If you'd
	* like to delete an in-progress batch, you must first cancel it.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const betaDeletedMessageBatch =
	*   await client.beta.messages.batches.delete(
	*     'message_batch_id',
	*   );
	* ```
	*/
	delete(messageBatchID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.delete(path$1`/v1/messages/batches/${messageBatchID}?beta=true`, {
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() }, options?.headers])
		});
	}
	/**
	* Batches may be canceled any time before processing ends. Once cancellation is
	* initiated, the batch enters a `canceling` state, at which time the system may
	* complete any in-progress, non-interruptible requests before finalizing
	* cancellation.
	*
	* The number of canceled requests is specified in `request_counts`. To determine
	* which requests were canceled, check the individual results within the batch.
	* Note that cancellation may not result in any canceled requests if they were
	* non-interruptible.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const betaMessageBatch =
	*   await client.beta.messages.batches.cancel(
	*     'message_batch_id',
	*   );
	* ```
	*/
	cancel(messageBatchID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.post(path$1`/v1/messages/batches/${messageBatchID}/cancel?beta=true`, {
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() }, options?.headers])
		});
	}
	/**
	* Streams the results of a Message Batch as a `.jsonl` file.
	*
	* Each line in the file is a JSON object containing the result of a single request
	* in the Message Batch. Results are not guaranteed to be in the same order as
	* requests. Use the `custom_id` field to match results to requests.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const betaMessageBatchIndividualResponse =
	*   await client.beta.messages.batches.results(
	*     'message_batch_id',
	*   );
	* ```
	*/
	async results(messageBatchID, params = {}, options) {
		const batch = await this.retrieve(messageBatchID);
		if (!batch.results_url) throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
		const { betas } = params ?? {};
		return this._client.get(batch.results_url, {
			...options,
			headers: buildHeaders([{
				"anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
				Accept: "application/binary"
			}, options?.headers]),
			stream: true,
			__binaryResponse: true
		})._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
const tokenize = (input) => {
	let current = 0;
	let tokens = [];
	while (current < input.length) {
		let char = input[current];
		if (char === "\\") {
			current++;
			continue;
		}
		if (char === "{") {
			tokens.push({
				type: "brace",
				value: "{"
			});
			current++;
			continue;
		}
		if (char === "}") {
			tokens.push({
				type: "brace",
				value: "}"
			});
			current++;
			continue;
		}
		if (char === "[") {
			tokens.push({
				type: "paren",
				value: "["
			});
			current++;
			continue;
		}
		if (char === "]") {
			tokens.push({
				type: "paren",
				value: "]"
			});
			current++;
			continue;
		}
		if (char === ":") {
			tokens.push({
				type: "separator",
				value: ":"
			});
			current++;
			continue;
		}
		if (char === ",") {
			tokens.push({
				type: "delimiter",
				value: ","
			});
			current++;
			continue;
		}
		if (char === "\"") {
			let value = "";
			let danglingQuote = false;
			char = input[++current];
			while (char !== "\"") {
				if (current === input.length) {
					danglingQuote = true;
					break;
				}
				if (char === "\\") {
					current++;
					if (current === input.length) {
						danglingQuote = true;
						break;
					}
					value += char + input[current];
					char = input[++current];
				} else {
					value += char;
					char = input[++current];
				}
			}
			char = input[++current];
			if (!danglingQuote) tokens.push({
				type: "string",
				value
			});
			continue;
		}
		let WHITESPACE = /\s/;
		if (char && WHITESPACE.test(char)) {
			current++;
			continue;
		}
		let NUMBERS = /[0-9]/;
		if (char && NUMBERS.test(char) || char === "-" || char === ".") {
			let value = "";
			if (char === "-") {
				value += char;
				char = input[++current];
			}
			while (char && NUMBERS.test(char) || char === ".") {
				value += char;
				char = input[++current];
			}
			tokens.push({
				type: "number",
				value
			});
			continue;
		}
		let LETTERS = /[a-z]/i;
		if (char && LETTERS.test(char)) {
			let value = "";
			while (char && LETTERS.test(char)) {
				if (current === input.length) break;
				value += char;
				char = input[++current];
			}
			if (value == "true" || value == "false" || value === "null") tokens.push({
				type: "name",
				value
			});
			else {
				current++;
				continue;
			}
			continue;
		}
		current++;
	}
	return tokens;
}, strip = (tokens) => {
	if (tokens.length === 0) return tokens;
	let lastToken = tokens[tokens.length - 1];
	switch (lastToken.type) {
		case "separator":
			tokens = tokens.slice(0, tokens.length - 1);
			return strip(tokens);
		case "number":
			let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
			if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-") {
				tokens = tokens.slice(0, tokens.length - 1);
				return strip(tokens);
			}
		case "string":
			let tokenBeforeTheLastToken = tokens[tokens.length - 2];
			if (tokenBeforeTheLastToken?.type === "delimiter") {
				tokens = tokens.slice(0, tokens.length - 1);
				return strip(tokens);
			} else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{") {
				tokens = tokens.slice(0, tokens.length - 1);
				return strip(tokens);
			}
			break;
		case "delimiter":
			tokens = tokens.slice(0, tokens.length - 1);
			return strip(tokens);
	}
	return tokens;
}, unstrip = (tokens) => {
	let tail = [];
	tokens.map((token) => {
		if (token.type === "brace") if (token.value === "{") tail.push("}");
		else tail.splice(tail.lastIndexOf("}"), 1);
		if (token.type === "paren") if (token.value === "[") tail.push("]");
		else tail.splice(tail.lastIndexOf("]"), 1);
	});
	if (tail.length > 0) tail.reverse().map((item) => {
		if (item === "}") tokens.push({
			type: "brace",
			value: "}"
		});
		else if (item === "]") tokens.push({
			type: "paren",
			value: "]"
		});
	});
	return tokens;
}, generate = (tokens) => {
	let output = "";
	tokens.map((token) => {
		switch (token.type) {
			case "string":
				output += "\"" + token.value + "\"";
				break;
			default:
				output += token.value;
				break;
		}
	});
	return output;
}, partialParse = (input) => JSON.parse(generate(unstrip(strip(tokenize(input)))));

//#endregion
//#region node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var _BetaMessageStream_instances, _BetaMessageStream_currentMessageSnapshot, _BetaMessageStream_connectedPromise, _BetaMessageStream_resolveConnectedPromise, _BetaMessageStream_rejectConnectedPromise, _BetaMessageStream_endPromise, _BetaMessageStream_resolveEndPromise, _BetaMessageStream_rejectEndPromise, _BetaMessageStream_listeners, _BetaMessageStream_ended, _BetaMessageStream_errored, _BetaMessageStream_aborted, _BetaMessageStream_catchingPromiseCreated, _BetaMessageStream_response, _BetaMessageStream_request_id, _BetaMessageStream_getFinalMessage, _BetaMessageStream_getFinalText, _BetaMessageStream_handleError, _BetaMessageStream_beginRequest, _BetaMessageStream_addStreamEvent, _BetaMessageStream_endRequest, _BetaMessageStream_accumulateMessage;
const JSON_BUF_PROPERTY$1 = "__json_buf";
var BetaMessageStream = class BetaMessageStream {
	constructor() {
		_BetaMessageStream_instances.add(this);
		this.messages = [];
		this.receivedMessages = [];
		_BetaMessageStream_currentMessageSnapshot.set(this, void 0);
		this.controller = new AbortController();
		_BetaMessageStream_connectedPromise.set(this, void 0);
		_BetaMessageStream_resolveConnectedPromise.set(this, () => {});
		_BetaMessageStream_rejectConnectedPromise.set(this, () => {});
		_BetaMessageStream_endPromise.set(this, void 0);
		_BetaMessageStream_resolveEndPromise.set(this, () => {});
		_BetaMessageStream_rejectEndPromise.set(this, () => {});
		_BetaMessageStream_listeners.set(this, {});
		_BetaMessageStream_ended.set(this, false);
		_BetaMessageStream_errored.set(this, false);
		_BetaMessageStream_aborted.set(this, false);
		_BetaMessageStream_catchingPromiseCreated.set(this, false);
		_BetaMessageStream_response.set(this, void 0);
		_BetaMessageStream_request_id.set(this, void 0);
		_BetaMessageStream_handleError.set(this, (error) => {
			__classPrivateFieldSet(this, _BetaMessageStream_errored, true, "f");
			if (isAbortError(error)) error = new APIUserAbortError();
			if (error instanceof APIUserAbortError) {
				__classPrivateFieldSet(this, _BetaMessageStream_aborted, true, "f");
				return this._emit("abort", error);
			}
			if (error instanceof AnthropicError) return this._emit("error", error);
			if (error instanceof Error) {
				const anthropicError = new AnthropicError(error.message);
				anthropicError.cause = error;
				return this._emit("error", anthropicError);
			}
			return this._emit("error", new AnthropicError(String(error)));
		});
		__classPrivateFieldSet(this, _BetaMessageStream_connectedPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _BetaMessageStream_resolveConnectedPromise, resolve, "f");
			__classPrivateFieldSet(this, _BetaMessageStream_rejectConnectedPromise, reject, "f");
		}), "f");
		__classPrivateFieldSet(this, _BetaMessageStream_endPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _BetaMessageStream_resolveEndPromise, resolve, "f");
			__classPrivateFieldSet(this, _BetaMessageStream_rejectEndPromise, reject, "f");
		}), "f");
		__classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f").catch(() => {});
		__classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f").catch(() => {});
	}
	get response() {
		return __classPrivateFieldGet(this, _BetaMessageStream_response, "f");
	}
	get request_id() {
		return __classPrivateFieldGet(this, _BetaMessageStream_request_id, "f");
	}
	/**
	* Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
	* returned vie the `request-id` header which is useful for debugging requests and resporting
	* issues to Anthropic.
	*
	* This is the same as the `APIPromise.withResponse()` method.
	*
	* This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
	* as no `Response` is available.
	*/
	async withResponse() {
		const response = await __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f");
		if (!response) throw new Error("Could not resolve a `Response` object");
		return {
			data: this,
			response,
			request_id: response.headers.get("request-id")
		};
	}
	/**
	* Intended for use on the frontend, consuming a stream produced with
	* `.toReadableStream()` on the backend.
	*
	* Note that messages sent to the model do not appear in `.on('message')`
	* in this context.
	*/
	static fromReadableStream(stream) {
		const runner = new BetaMessageStream();
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	static createMessage(messages, params, options) {
		const runner = new BetaMessageStream();
		for (const message of params.messages) runner._addMessageParam(message);
		runner._run(() => runner._createMessage(messages, {
			...params,
			stream: true
		}, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	_run(executor) {
		executor().then(() => {
			this._emitFinal();
			this._emit("end");
		}, __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f"));
	}
	_addMessageParam(message) {
		this.messages.push(message);
	}
	_addMessage(message, emit = true) {
		this.receivedMessages.push(message);
		if (emit) this._emit("message", message);
	}
	async _createMessage(messages, params, options) {
		const signal = options?.signal;
		if (signal) {
			if (signal.aborted) this.controller.abort();
			signal.addEventListener("abort", () => this.controller.abort());
		}
		__classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
		const { response, data: stream } = await messages.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		}).withResponse();
		this._connected(response);
		for await (const event of stream) __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		__classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
	}
	_connected(response) {
		if (this.ended) return;
		__classPrivateFieldSet(this, _BetaMessageStream_response, response, "f");
		__classPrivateFieldSet(this, _BetaMessageStream_request_id, response?.headers.get("request-id"), "f");
		__classPrivateFieldGet(this, _BetaMessageStream_resolveConnectedPromise, "f").call(this, response);
		this._emit("connect");
	}
	get ended() {
		return __classPrivateFieldGet(this, _BetaMessageStream_ended, "f");
	}
	get errored() {
		return __classPrivateFieldGet(this, _BetaMessageStream_errored, "f");
	}
	get aborted() {
		return __classPrivateFieldGet(this, _BetaMessageStream_aborted, "f");
	}
	abort() {
		this.controller.abort();
	}
	/**
	* Adds the listener function to the end of the listeners array for the event.
	* No checks are made to see if the listener has already been added. Multiple calls passing
	* the same combination of event and listener will result in the listener being added, and
	* called, multiple times.
	* @returns this MessageStream, so that calls can be chained
	*/
	on(event, listener) {
		const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
		listeners.push({ listener });
		return this;
	}
	/**
	* Removes the specified listener from the listener array for the event.
	* off() will remove, at most, one instance of a listener from the listener array. If any single
	* listener has been added multiple times to the listener array for the specified event, then
	* off() must be called multiple times to remove each instance.
	* @returns this MessageStream, so that calls can be chained
	*/
	off(event, listener) {
		const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
		if (!listeners) return this;
		const index = listeners.findIndex((l) => l.listener === listener);
		if (index >= 0) listeners.splice(index, 1);
		return this;
	}
	/**
	* Adds a one-time listener function for the event. The next time the event is triggered,
	* this listener is removed and then invoked.
	* @returns this MessageStream, so that calls can be chained
	*/
	once(event, listener) {
		const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
		listeners.push({
			listener,
			once: true
		});
		return this;
	}
	/**
	* This is similar to `.once()`, but returns a Promise that resolves the next time
	* the event is triggered, instead of calling a listener callback.
	* @returns a Promise that resolves the next time given event is triggered,
	* or rejects if an error is emitted.  (If you request the 'error' event,
	* returns a promise that resolves with the error).
	*
	* Example:
	*
	*   const message = await stream.emitted('message') // rejects if the stream errors
	*/
	emitted(event) {
		return new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
			if (event !== "error") this.once("error", reject);
			this.once(event, resolve);
		});
	}
	async done() {
		__classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
		await __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f");
	}
	get currentMessage() {
		return __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
	}
	/**
	* @returns a promise that resolves with the the final assistant Message response,
	* or rejects if an error occurred or the stream ended prematurely without producing a Message.
	*/
	async finalMessage() {
		await this.done();
		return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this);
	}
	/**
	* @returns a promise that resolves with the the final assistant Message's text response, concatenated
	* together if there are more than one text blocks.
	* Rejects if an error occurred or the stream ended prematurely without producing a Message.
	*/
	async finalText() {
		await this.done();
		return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalText).call(this);
	}
	_emit(event, ...args) {
		if (__classPrivateFieldGet(this, _BetaMessageStream_ended, "f")) return;
		if (event === "end") {
			__classPrivateFieldSet(this, _BetaMessageStream_ended, true, "f");
			__classPrivateFieldGet(this, _BetaMessageStream_resolveEndPromise, "f").call(this);
		}
		const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
		if (listeners) {
			__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
			listeners.forEach(({ listener }) => listener(...args));
		}
		if (event === "abort") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
			return;
		}
		if (event === "error") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
		}
	}
	_emitFinal() {
		const finalMessage = this.receivedMessages.at(-1);
		if (finalMessage) this._emit("finalMessage", __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this));
	}
	async _fromReadableStream(readableStream, options) {
		const signal = options?.signal;
		if (signal) {
			if (signal.aborted) this.controller.abort();
			signal.addEventListener("abort", () => this.controller.abort());
		}
		__classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
		this._connected(null);
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		for await (const event of stream) __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		__classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
	}
	[(_BetaMessageStream_currentMessageSnapshot = new WeakMap(), _BetaMessageStream_connectedPromise = new WeakMap(), _BetaMessageStream_resolveConnectedPromise = new WeakMap(), _BetaMessageStream_rejectConnectedPromise = new WeakMap(), _BetaMessageStream_endPromise = new WeakMap(), _BetaMessageStream_resolveEndPromise = new WeakMap(), _BetaMessageStream_rejectEndPromise = new WeakMap(), _BetaMessageStream_listeners = new WeakMap(), _BetaMessageStream_ended = new WeakMap(), _BetaMessageStream_errored = new WeakMap(), _BetaMessageStream_aborted = new WeakMap(), _BetaMessageStream_catchingPromiseCreated = new WeakMap(), _BetaMessageStream_response = new WeakMap(), _BetaMessageStream_request_id = new WeakMap(), _BetaMessageStream_handleError = new WeakMap(), _BetaMessageStream_instances = new WeakSet(), _BetaMessageStream_getFinalMessage = function _BetaMessageStream_getFinalMessage$1() {
		if (this.receivedMessages.length === 0) throw new AnthropicError("stream ended without producing a Message with role=assistant");
		return this.receivedMessages.at(-1);
	}, _BetaMessageStream_getFinalText = function _BetaMessageStream_getFinalText$1() {
		if (this.receivedMessages.length === 0) throw new AnthropicError("stream ended without producing a Message with role=assistant");
		const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
		if (textBlocks.length === 0) throw new AnthropicError("stream ended without producing a content block with type=text");
		return textBlocks.join(" ");
	}, _BetaMessageStream_beginRequest = function _BetaMessageStream_beginRequest$1() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
	}, _BetaMessageStream_addStreamEvent = function _BetaMessageStream_addStreamEvent$1(event) {
		if (this.ended) return;
		const messageSnapshot = __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_accumulateMessage).call(this, event);
		this._emit("streamEvent", event, messageSnapshot);
		switch (event.type) {
			case "content_block_delta": {
				const content = messageSnapshot.content.at(-1);
				switch (event.delta.type) {
					case "text_delta": {
						if (content.type === "text") this._emit("text", event.delta.text, content.text || "");
						break;
					}
					case "citations_delta": {
						if (content.type === "text") this._emit("citation", event.delta.citation, content.citations ?? []);
						break;
					}
					case "input_json_delta": {
						if (content.type === "tool_use" && content.input) this._emit("inputJson", event.delta.partial_json, content.input);
						break;
					}
					case "thinking_delta": {
						if (content.type === "thinking") this._emit("thinking", event.delta.thinking, content.thinking);
						break;
					}
					case "signature_delta": {
						if (content.type === "thinking") this._emit("signature", content.signature);
						break;
					}
					default: checkNever$1(event.delta);
				}
				break;
			}
			case "message_stop": {
				this._addMessageParam(messageSnapshot);
				this._addMessage(messageSnapshot, true);
				break;
			}
			case "content_block_stop": {
				this._emit("contentBlock", messageSnapshot.content.at(-1));
				break;
			}
			case "message_start": {
				__classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
				break;
			}
			case "content_block_start":
			case "message_delta": break;
		}
	}, _BetaMessageStream_endRequest = function _BetaMessageStream_endRequest$1() {
		if (this.ended) throw new AnthropicError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
		if (!snapshot) throw new AnthropicError(`request ended without sending any chunks`);
		__classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
		return snapshot;
	}, _BetaMessageStream_accumulateMessage = function _BetaMessageStream_accumulateMessage$1(event) {
		let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
		if (event.type === "message_start") {
			if (snapshot) throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
			return event.message;
		}
		if (!snapshot) throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
		switch (event.type) {
			case "message_stop": return snapshot;
			case "message_delta":
				snapshot.stop_reason = event.delta.stop_reason;
				snapshot.stop_sequence = event.delta.stop_sequence;
				snapshot.usage.output_tokens = event.usage.output_tokens;
				if (event.usage.input_tokens != null) snapshot.usage.input_tokens = event.usage.input_tokens;
				if (event.usage.cache_creation_input_tokens != null) snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
				if (event.usage.cache_read_input_tokens != null) snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
				if (event.usage.server_tool_use != null) snapshot.usage.server_tool_use = event.usage.server_tool_use;
				return snapshot;
			case "content_block_start":
				snapshot.content.push(event.content_block);
				return snapshot;
			case "content_block_delta": {
				const snapshotContent = snapshot.content.at(event.index);
				switch (event.delta.type) {
					case "text_delta": {
						if (snapshotContent?.type === "text") snapshotContent.text += event.delta.text;
						break;
					}
					case "citations_delta": {
						if (snapshotContent?.type === "text") {
							snapshotContent.citations ?? (snapshotContent.citations = []);
							snapshotContent.citations.push(event.delta.citation);
						}
						break;
					}
					case "input_json_delta": {
						if (snapshotContent?.type === "tool_use") {
							let jsonBuf = snapshotContent[JSON_BUF_PROPERTY$1] || "";
							jsonBuf += event.delta.partial_json;
							Object.defineProperty(snapshotContent, JSON_BUF_PROPERTY$1, {
								value: jsonBuf,
								enumerable: false,
								writable: true
							});
							if (jsonBuf) snapshotContent.input = partialParse(jsonBuf);
						}
						break;
					}
					case "thinking_delta": {
						if (snapshotContent?.type === "thinking") snapshotContent.thinking += event.delta.thinking;
						break;
					}
					case "signature_delta": {
						if (snapshotContent?.type === "thinking") snapshotContent.signature = event.delta.signature;
						break;
					}
					default: checkNever$1(event.delta);
				}
				return snapshot;
			}
			case "content_block_stop": return snapshot;
		}
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("streamEvent", (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk$1) => chunk$1 ? {
						value: chunk$1,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				const chunk = pushQueue.shift();
				return {
					value: chunk,
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	toReadableStream() {
		const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
		return stream.toReadableStream();
	}
};
function checkNever$1(x) {}

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
const DEPRECATED_MODELS$1 = {
	"claude-1.3": "November 6th, 2024",
	"claude-1.3-100k": "November 6th, 2024",
	"claude-instant-1.1": "November 6th, 2024",
	"claude-instant-1.1-100k": "November 6th, 2024",
	"claude-instant-1.2": "November 6th, 2024",
	"claude-3-sonnet-20240229": "July 21st, 2025",
	"claude-2.1": "July 21st, 2025",
	"claude-2.0": "July 21st, 2025"
};
var Messages$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.batches = new Batches$1(this._client);
	}
	create(params, options) {
		const { betas,...body } = params;
		if (body.model in DEPRECATED_MODELS$1) console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS$1[body.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
		return this._client.post("/v1/messages?beta=true", {
			body,
			timeout: this._client._options.timeout ?? (body.stream ? 6e5 : this._client._calculateNonstreamingTimeout(body.max_tokens)),
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers]),
			stream: params.stream ?? false
		});
	}
	/**
	* Create a Message stream
	*/
	stream(body, options) {
		return BetaMessageStream.createMessage(this, body, options);
	}
	/**
	* Count the number of tokens in a Message.
	*
	* The Token Count API can be used to count the number of tokens in a Message,
	* including tools, images, and documents, without creating it.
	*
	* Learn more about token counting in our
	* [user guide](/en/docs/build-with-claude/token-counting)
	*
	* @example
	* ```ts
	* const betaMessageTokensCount =
	*   await client.beta.messages.countTokens({
	*     messages: [{ content: 'string', role: 'user' }],
	*     model: 'claude-3-7-sonnet-latest',
	*   });
	* ```
	*/
	countTokens(params, options) {
		const { betas,...body } = params;
		return this._client.post("/v1/messages/count_tokens?beta=true", {
			body,
			...options,
			headers: buildHeaders([{ "anthropic-beta": [...betas ?? [], "token-counting-2024-11-01"].toString() }, options?.headers])
		});
	}
};
Messages$1.Batches = Batches$1;

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta = class extends APIResource {
	constructor() {
		super(...arguments);
		this.models = new Models$1(this._client);
		this.messages = new Messages$1(this._client);
	}
};
Beta.Models = Models$1;
Beta.Messages = Messages$1;

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Completions = class extends APIResource {
	create(params, options) {
		const { betas,...body } = params;
		return this._client.post("/v1/complete", {
			body,
			timeout: this._client._options.timeout ?? 6e5,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers]),
			stream: params.stream ?? false
		});
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Batches = class extends APIResource {
	/**
	* Send a batch of Message creation requests.
	*
	* The Message Batches API can be used to process multiple Messages API requests at
	* once. Once a Message Batch is created, it begins processing immediately. Batches
	* can take up to 24 hours to complete.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const messageBatch = await client.messages.batches.create({
	*   requests: [
	*     {
	*       custom_id: 'my-custom-id-1',
	*       params: {
	*         max_tokens: 1024,
	*         messages: [
	*           { content: 'Hello, world', role: 'user' },
	*         ],
	*         model: 'claude-3-7-sonnet-20250219',
	*       },
	*     },
	*   ],
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/v1/messages/batches", {
			body,
			...options
		});
	}
	/**
	* This endpoint is idempotent and can be used to poll for Message Batch
	* completion. To access the results of a Message Batch, make a request to the
	* `results_url` field in the response.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const messageBatch = await client.messages.batches.retrieve(
	*   'message_batch_id',
	* );
	* ```
	*/
	retrieve(messageBatchID, options) {
		return this._client.get(path$1`/v1/messages/batches/${messageBatchID}`, options);
	}
	/**
	* List all Message Batches within a Workspace. Most recently created batches are
	* returned first.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const messageBatch of client.messages.batches.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/v1/messages/batches", Page, {
			query,
			...options
		});
	}
	/**
	* Delete a Message Batch.
	*
	* Message Batches can only be deleted once they've finished processing. If you'd
	* like to delete an in-progress batch, you must first cancel it.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const deletedMessageBatch =
	*   await client.messages.batches.delete('message_batch_id');
	* ```
	*/
	delete(messageBatchID, options) {
		return this._client.delete(path$1`/v1/messages/batches/${messageBatchID}`, options);
	}
	/**
	* Batches may be canceled any time before processing ends. Once cancellation is
	* initiated, the batch enters a `canceling` state, at which time the system may
	* complete any in-progress, non-interruptible requests before finalizing
	* cancellation.
	*
	* The number of canceled requests is specified in `request_counts`. To determine
	* which requests were canceled, check the individual results within the batch.
	* Note that cancellation may not result in any canceled requests if they were
	* non-interruptible.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const messageBatch = await client.messages.batches.cancel(
	*   'message_batch_id',
	* );
	* ```
	*/
	cancel(messageBatchID, options) {
		return this._client.post(path$1`/v1/messages/batches/${messageBatchID}/cancel`, options);
	}
	/**
	* Streams the results of a Message Batch as a `.jsonl` file.
	*
	* Each line in the file is a JSON object containing the result of a single request
	* in the Message Batch. Results are not guaranteed to be in the same order as
	* requests. Use the `custom_id` field to match results to requests.
	*
	* Learn more about the Message Batches API in our
	* [user guide](/en/docs/build-with-claude/batch-processing)
	*
	* @example
	* ```ts
	* const messageBatchIndividualResponse =
	*   await client.messages.batches.results('message_batch_id');
	* ```
	*/
	async results(messageBatchID, options) {
		const batch = await this.retrieve(messageBatchID);
		if (!batch.results_url) throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
		return this._client.get(batch.results_url, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			stream: true,
			__binaryResponse: true
		})._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var _MessageStream_instances, _MessageStream_currentMessageSnapshot, _MessageStream_connectedPromise, _MessageStream_resolveConnectedPromise, _MessageStream_rejectConnectedPromise, _MessageStream_endPromise, _MessageStream_resolveEndPromise, _MessageStream_rejectEndPromise, _MessageStream_listeners, _MessageStream_ended, _MessageStream_errored, _MessageStream_aborted, _MessageStream_catchingPromiseCreated, _MessageStream_response, _MessageStream_request_id, _MessageStream_getFinalMessage, _MessageStream_getFinalText, _MessageStream_handleError, _MessageStream_beginRequest, _MessageStream_addStreamEvent, _MessageStream_endRequest, _MessageStream_accumulateMessage;
const JSON_BUF_PROPERTY = "__json_buf";
var MessageStream = class MessageStream {
	constructor() {
		_MessageStream_instances.add(this);
		this.messages = [];
		this.receivedMessages = [];
		_MessageStream_currentMessageSnapshot.set(this, void 0);
		this.controller = new AbortController();
		_MessageStream_connectedPromise.set(this, void 0);
		_MessageStream_resolveConnectedPromise.set(this, () => {});
		_MessageStream_rejectConnectedPromise.set(this, () => {});
		_MessageStream_endPromise.set(this, void 0);
		_MessageStream_resolveEndPromise.set(this, () => {});
		_MessageStream_rejectEndPromise.set(this, () => {});
		_MessageStream_listeners.set(this, {});
		_MessageStream_ended.set(this, false);
		_MessageStream_errored.set(this, false);
		_MessageStream_aborted.set(this, false);
		_MessageStream_catchingPromiseCreated.set(this, false);
		_MessageStream_response.set(this, void 0);
		_MessageStream_request_id.set(this, void 0);
		_MessageStream_handleError.set(this, (error) => {
			__classPrivateFieldSet(this, _MessageStream_errored, true, "f");
			if (isAbortError(error)) error = new APIUserAbortError();
			if (error instanceof APIUserAbortError) {
				__classPrivateFieldSet(this, _MessageStream_aborted, true, "f");
				return this._emit("abort", error);
			}
			if (error instanceof AnthropicError) return this._emit("error", error);
			if (error instanceof Error) {
				const anthropicError = new AnthropicError(error.message);
				anthropicError.cause = error;
				return this._emit("error", anthropicError);
			}
			return this._emit("error", new AnthropicError(String(error)));
		});
		__classPrivateFieldSet(this, _MessageStream_connectedPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _MessageStream_resolveConnectedPromise, resolve, "f");
			__classPrivateFieldSet(this, _MessageStream_rejectConnectedPromise, reject, "f");
		}), "f");
		__classPrivateFieldSet(this, _MessageStream_endPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _MessageStream_resolveEndPromise, resolve, "f");
			__classPrivateFieldSet(this, _MessageStream_rejectEndPromise, reject, "f");
		}), "f");
		__classPrivateFieldGet(this, _MessageStream_connectedPromise, "f").catch(() => {});
		__classPrivateFieldGet(this, _MessageStream_endPromise, "f").catch(() => {});
	}
	get response() {
		return __classPrivateFieldGet(this, _MessageStream_response, "f");
	}
	get request_id() {
		return __classPrivateFieldGet(this, _MessageStream_request_id, "f");
	}
	/**
	* Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
	* returned vie the `request-id` header which is useful for debugging requests and resporting
	* issues to Anthropic.
	*
	* This is the same as the `APIPromise.withResponse()` method.
	*
	* This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
	* as no `Response` is available.
	*/
	async withResponse() {
		const response = await __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f");
		if (!response) throw new Error("Could not resolve a `Response` object");
		return {
			data: this,
			response,
			request_id: response.headers.get("request-id")
		};
	}
	/**
	* Intended for use on the frontend, consuming a stream produced with
	* `.toReadableStream()` on the backend.
	*
	* Note that messages sent to the model do not appear in `.on('message')`
	* in this context.
	*/
	static fromReadableStream(stream) {
		const runner = new MessageStream();
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	static createMessage(messages, params, options) {
		const runner = new MessageStream();
		for (const message of params.messages) runner._addMessageParam(message);
		runner._run(() => runner._createMessage(messages, {
			...params,
			stream: true
		}, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	_run(executor) {
		executor().then(() => {
			this._emitFinal();
			this._emit("end");
		}, __classPrivateFieldGet(this, _MessageStream_handleError, "f"));
	}
	_addMessageParam(message) {
		this.messages.push(message);
	}
	_addMessage(message, emit = true) {
		this.receivedMessages.push(message);
		if (emit) this._emit("message", message);
	}
	async _createMessage(messages, params, options) {
		const signal = options?.signal;
		if (signal) {
			if (signal.aborted) this.controller.abort();
			signal.addEventListener("abort", () => this.controller.abort());
		}
		__classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
		const { response, data: stream } = await messages.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		}).withResponse();
		this._connected(response);
		for await (const event of stream) __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		__classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
	}
	_connected(response) {
		if (this.ended) return;
		__classPrivateFieldSet(this, _MessageStream_response, response, "f");
		__classPrivateFieldSet(this, _MessageStream_request_id, response?.headers.get("request-id"), "f");
		__classPrivateFieldGet(this, _MessageStream_resolveConnectedPromise, "f").call(this, response);
		this._emit("connect");
	}
	get ended() {
		return __classPrivateFieldGet(this, _MessageStream_ended, "f");
	}
	get errored() {
		return __classPrivateFieldGet(this, _MessageStream_errored, "f");
	}
	get aborted() {
		return __classPrivateFieldGet(this, _MessageStream_aborted, "f");
	}
	abort() {
		this.controller.abort();
	}
	/**
	* Adds the listener function to the end of the listeners array for the event.
	* No checks are made to see if the listener has already been added. Multiple calls passing
	* the same combination of event and listener will result in the listener being added, and
	* called, multiple times.
	* @returns this MessageStream, so that calls can be chained
	*/
	on(event, listener) {
		const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
		listeners.push({ listener });
		return this;
	}
	/**
	* Removes the specified listener from the listener array for the event.
	* off() will remove, at most, one instance of a listener from the listener array. If any single
	* listener has been added multiple times to the listener array for the specified event, then
	* off() must be called multiple times to remove each instance.
	* @returns this MessageStream, so that calls can be chained
	*/
	off(event, listener) {
		const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
		if (!listeners) return this;
		const index = listeners.findIndex((l) => l.listener === listener);
		if (index >= 0) listeners.splice(index, 1);
		return this;
	}
	/**
	* Adds a one-time listener function for the event. The next time the event is triggered,
	* this listener is removed and then invoked.
	* @returns this MessageStream, so that calls can be chained
	*/
	once(event, listener) {
		const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
		listeners.push({
			listener,
			once: true
		});
		return this;
	}
	/**
	* This is similar to `.once()`, but returns a Promise that resolves the next time
	* the event is triggered, instead of calling a listener callback.
	* @returns a Promise that resolves the next time given event is triggered,
	* or rejects if an error is emitted.  (If you request the 'error' event,
	* returns a promise that resolves with the error).
	*
	* Example:
	*
	*   const message = await stream.emitted('message') // rejects if the stream errors
	*/
	emitted(event) {
		return new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
			if (event !== "error") this.once("error", reject);
			this.once(event, resolve);
		});
	}
	async done() {
		__classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
		await __classPrivateFieldGet(this, _MessageStream_endPromise, "f");
	}
	get currentMessage() {
		return __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
	}
	/**
	* @returns a promise that resolves with the the final assistant Message response,
	* or rejects if an error occurred or the stream ended prematurely without producing a Message.
	*/
	async finalMessage() {
		await this.done();
		return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this);
	}
	/**
	* @returns a promise that resolves with the the final assistant Message's text response, concatenated
	* together if there are more than one text blocks.
	* Rejects if an error occurred or the stream ended prematurely without producing a Message.
	*/
	async finalText() {
		await this.done();
		return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalText).call(this);
	}
	_emit(event, ...args) {
		if (__classPrivateFieldGet(this, _MessageStream_ended, "f")) return;
		if (event === "end") {
			__classPrivateFieldSet(this, _MessageStream_ended, true, "f");
			__classPrivateFieldGet(this, _MessageStream_resolveEndPromise, "f").call(this);
		}
		const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
		if (listeners) {
			__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
			listeners.forEach(({ listener }) => listener(...args));
		}
		if (event === "abort") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
			return;
		}
		if (event === "error") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
		}
	}
	_emitFinal() {
		const finalMessage = this.receivedMessages.at(-1);
		if (finalMessage) this._emit("finalMessage", __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this));
	}
	async _fromReadableStream(readableStream, options) {
		const signal = options?.signal;
		if (signal) {
			if (signal.aborted) this.controller.abort();
			signal.addEventListener("abort", () => this.controller.abort());
		}
		__classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
		this._connected(null);
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		for await (const event of stream) __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		__classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
	}
	[(_MessageStream_currentMessageSnapshot = new WeakMap(), _MessageStream_connectedPromise = new WeakMap(), _MessageStream_resolveConnectedPromise = new WeakMap(), _MessageStream_rejectConnectedPromise = new WeakMap(), _MessageStream_endPromise = new WeakMap(), _MessageStream_resolveEndPromise = new WeakMap(), _MessageStream_rejectEndPromise = new WeakMap(), _MessageStream_listeners = new WeakMap(), _MessageStream_ended = new WeakMap(), _MessageStream_errored = new WeakMap(), _MessageStream_aborted = new WeakMap(), _MessageStream_catchingPromiseCreated = new WeakMap(), _MessageStream_response = new WeakMap(), _MessageStream_request_id = new WeakMap(), _MessageStream_handleError = new WeakMap(), _MessageStream_instances = new WeakSet(), _MessageStream_getFinalMessage = function _MessageStream_getFinalMessage$1() {
		if (this.receivedMessages.length === 0) throw new AnthropicError("stream ended without producing a Message with role=assistant");
		return this.receivedMessages.at(-1);
	}, _MessageStream_getFinalText = function _MessageStream_getFinalText$1() {
		if (this.receivedMessages.length === 0) throw new AnthropicError("stream ended without producing a Message with role=assistant");
		const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
		if (textBlocks.length === 0) throw new AnthropicError("stream ended without producing a content block with type=text");
		return textBlocks.join(" ");
	}, _MessageStream_beginRequest = function _MessageStream_beginRequest$1() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
	}, _MessageStream_addStreamEvent = function _MessageStream_addStreamEvent$1(event) {
		if (this.ended) return;
		const messageSnapshot = __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_accumulateMessage).call(this, event);
		this._emit("streamEvent", event, messageSnapshot);
		switch (event.type) {
			case "content_block_delta": {
				const content = messageSnapshot.content.at(-1);
				switch (event.delta.type) {
					case "text_delta": {
						if (content.type === "text") this._emit("text", event.delta.text, content.text || "");
						break;
					}
					case "citations_delta": {
						if (content.type === "text") this._emit("citation", event.delta.citation, content.citations ?? []);
						break;
					}
					case "input_json_delta": {
						if (content.type === "tool_use" && content.input) this._emit("inputJson", event.delta.partial_json, content.input);
						break;
					}
					case "thinking_delta": {
						if (content.type === "thinking") this._emit("thinking", event.delta.thinking, content.thinking);
						break;
					}
					case "signature_delta": {
						if (content.type === "thinking") this._emit("signature", content.signature);
						break;
					}
					default: checkNever(event.delta);
				}
				break;
			}
			case "message_stop": {
				this._addMessageParam(messageSnapshot);
				this._addMessage(messageSnapshot, true);
				break;
			}
			case "content_block_stop": {
				this._emit("contentBlock", messageSnapshot.content.at(-1));
				break;
			}
			case "message_start": {
				__classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, messageSnapshot, "f");
				break;
			}
			case "content_block_start":
			case "message_delta": break;
		}
	}, _MessageStream_endRequest = function _MessageStream_endRequest$1() {
		if (this.ended) throw new AnthropicError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
		if (!snapshot) throw new AnthropicError(`request ended without sending any chunks`);
		__classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
		return snapshot;
	}, _MessageStream_accumulateMessage = function _MessageStream_accumulateMessage$1(event) {
		let snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
		if (event.type === "message_start") {
			if (snapshot) throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
			return event.message;
		}
		if (!snapshot) throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
		switch (event.type) {
			case "message_stop": return snapshot;
			case "message_delta":
				snapshot.stop_reason = event.delta.stop_reason;
				snapshot.stop_sequence = event.delta.stop_sequence;
				snapshot.usage.output_tokens = event.usage.output_tokens;
				if (event.usage.input_tokens != null) snapshot.usage.input_tokens = event.usage.input_tokens;
				if (event.usage.cache_creation_input_tokens != null) snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
				if (event.usage.cache_read_input_tokens != null) snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
				if (event.usage.server_tool_use != null) snapshot.usage.server_tool_use = event.usage.server_tool_use;
				return snapshot;
			case "content_block_start":
				snapshot.content.push(event.content_block);
				return snapshot;
			case "content_block_delta": {
				const snapshotContent = snapshot.content.at(event.index);
				switch (event.delta.type) {
					case "text_delta": {
						if (snapshotContent?.type === "text") snapshotContent.text += event.delta.text;
						break;
					}
					case "citations_delta": {
						if (snapshotContent?.type === "text") {
							snapshotContent.citations ?? (snapshotContent.citations = []);
							snapshotContent.citations.push(event.delta.citation);
						}
						break;
					}
					case "input_json_delta": {
						if (snapshotContent?.type === "tool_use") {
							let jsonBuf = snapshotContent[JSON_BUF_PROPERTY] || "";
							jsonBuf += event.delta.partial_json;
							Object.defineProperty(snapshotContent, JSON_BUF_PROPERTY, {
								value: jsonBuf,
								enumerable: false,
								writable: true
							});
							if (jsonBuf) snapshotContent.input = partialParse(jsonBuf);
						}
						break;
					}
					case "thinking_delta": {
						if (snapshotContent?.type === "thinking") snapshotContent.thinking += event.delta.thinking;
						break;
					}
					case "signature_delta": {
						if (snapshotContent?.type === "thinking") snapshotContent.signature = event.delta.signature;
						break;
					}
					default: checkNever(event.delta);
				}
				return snapshot;
			}
			case "content_block_stop": return snapshot;
		}
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("streamEvent", (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk$1) => chunk$1 ? {
						value: chunk$1,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				const chunk = pushQueue.shift();
				return {
					value: chunk,
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	toReadableStream() {
		const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
		return stream.toReadableStream();
	}
};
function checkNever(x) {}

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var Messages = class extends APIResource {
	constructor() {
		super(...arguments);
		this.batches = new Batches(this._client);
	}
	create(body, options) {
		if (body.model in DEPRECATED_MODELS) console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
		return this._client.post("/v1/messages", {
			body,
			timeout: this._client._options.timeout ?? (body.stream ? 6e5 : this._client._calculateNonstreamingTimeout(body.max_tokens)),
			...options,
			stream: body.stream ?? false
		});
	}
	/**
	* Create a Message stream
	*/
	stream(body, options) {
		return MessageStream.createMessage(this, body, options);
	}
	/**
	* Count the number of tokens in a Message.
	*
	* The Token Count API can be used to count the number of tokens in a Message,
	* including tools, images, and documents, without creating it.
	*
	* Learn more about token counting in our
	* [user guide](/en/docs/build-with-claude/token-counting)
	*
	* @example
	* ```ts
	* const messageTokensCount =
	*   await client.messages.countTokens({
	*     messages: [{ content: 'string', role: 'user' }],
	*     model: 'claude-3-7-sonnet-latest',
	*   });
	* ```
	*/
	countTokens(body, options) {
		return this._client.post("/v1/messages/count_tokens", {
			body,
			...options
		});
	}
};
const DEPRECATED_MODELS = {
	"claude-1.3": "November 6th, 2024",
	"claude-1.3-100k": "November 6th, 2024",
	"claude-instant-1.1": "November 6th, 2024",
	"claude-instant-1.1-100k": "November 6th, 2024",
	"claude-instant-1.2": "November 6th, 2024",
	"claude-3-sonnet-20240229": "July 21st, 2025",
	"claude-2.1": "July 21st, 2025",
	"claude-2.0": "July 21st, 2025"
};
Messages.Batches = Batches;

//#endregion
//#region node_modules/@anthropic-ai/sdk/resources/models.mjs
var Models = class extends APIResource {
	/**
	* Get a specific model.
	*
	* The Models API response can be used to determine information about a specific
	* model or resolve a model alias to a model ID.
	*/
	retrieve(modelID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.get(path$1`/v1/models/${modelID}`, {
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers])
		});
	}
	/**
	* List available models.
	*
	* The Models API response can be used to determine which models are available for
	* use in the API. More recently released models are listed first.
	*/
	list(params = {}, options) {
		const { betas,...query } = params ?? {};
		return this._client.getAPIList("/v1/models", Page, {
			query,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 }, options?.headers])
		});
	}
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
/**
* Read an environment variable.
*
* Trims beginning and trailing whitespace.
*
* Will return undefined if the environment variable doesn't exist or cannot be accessed.
*/
const readEnv = (env) => {
	if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() ?? void 0;
	if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim();
	return void 0;
};

//#endregion
//#region node_modules/@anthropic-ai/sdk/client.mjs
var _a, _BaseAnthropic_encoder;
var BaseAnthropic = class {
	/**
	* API Client for interfacing with the Anthropic API.
	*
	* @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
	* @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
	* @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
	* @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
	* @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
	* @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
	* @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
	* @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
	* @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
	* @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
	*/
	constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey = readEnv("ANTHROPIC_API_KEY") ?? null, authToken = readEnv("ANTHROPIC_AUTH_TOKEN") ?? null,...opts } = {}) {
		_BaseAnthropic_encoder.set(this, void 0);
		const options = {
			apiKey,
			authToken,
			...opts,
			baseURL: baseURL || `https://api.anthropic.com`
		};
		if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) throw new AnthropicError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n");
		this.baseURL = options.baseURL;
		this.timeout = options.timeout ?? Anthropic.DEFAULT_TIMEOUT;
		this.logger = options.logger ?? console;
		const defaultLogLevel = "warn";
		this.logLevel = defaultLogLevel;
		this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? defaultLogLevel;
		this.fetchOptions = options.fetchOptions;
		this.maxRetries = options.maxRetries ?? 2;
		this.fetch = options.fetch ?? getDefaultFetch();
		__classPrivateFieldSet(this, _BaseAnthropic_encoder, FallbackEncoder, "f");
		this._options = options;
		this.apiKey = apiKey;
		this.authToken = authToken;
	}
	/**
	* Create a new client instance re-using the same options given to the current client with optional overriding.
	*/
	withOptions(options) {
		return new this.constructor({
			...this._options,
			baseURL: this.baseURL,
			maxRetries: this.maxRetries,
			timeout: this.timeout,
			logger: this.logger,
			logLevel: this.logLevel,
			fetchOptions: this.fetchOptions,
			apiKey: this.apiKey,
			authToken: this.authToken,
			...options
		});
	}
	defaultQuery() {
		return this._options.defaultQuery;
	}
	validateHeaders({ values, nulls }) {
		if (this.apiKey && values.get("x-api-key")) return;
		if (nulls.has("x-api-key")) return;
		if (this.authToken && values.get("authorization")) return;
		if (nulls.has("authorization")) return;
		throw new Error("Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the \"X-Api-Key\" or \"Authorization\" headers to be explicitly omitted");
	}
	authHeaders(opts) {
		return buildHeaders([this.apiKeyAuth(opts), this.bearerAuth(opts)]);
	}
	apiKeyAuth(opts) {
		if (this.apiKey == null) return void 0;
		return buildHeaders([{ "X-Api-Key": this.apiKey }]);
	}
	bearerAuth(opts) {
		if (this.authToken == null) return void 0;
		return buildHeaders([{ Authorization: `Bearer ${this.authToken}` }]);
	}
	/**
	* Basic re-implementation of `qs.stringify` for primitive types.
	*/
	stringifyQuery(query) {
		return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
			if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			if (value === null) return `${encodeURIComponent(key)}=`;
			throw new AnthropicError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
		}).join("&");
	}
	getUserAgent() {
		return `${this.constructor.name}/JS ${VERSION}`;
	}
	defaultIdempotencyKey() {
		return `stainless-node-retry-${uuid4()}`;
	}
	makeStatusError(status, error, message, headers) {
		return APIError.generate(status, error, message, headers);
	}
	buildURL(path$2, query) {
		const url = isAbsoluteURL(path$2) ? new URL(path$2) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path$2.startsWith("/") ? path$2.slice(1) : path$2));
		const defaultQuery = this.defaultQuery();
		if (!isEmptyObj(defaultQuery)) query = {
			...defaultQuery,
			...query
		};
		if (typeof query === "object" && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
		return url.toString();
	}
	_calculateNonstreamingTimeout(maxTokens) {
		const defaultTimeout = 10 * 60;
		const expectedTimeout = 60 * 60 * maxTokens / 128e3;
		if (expectedTimeout > defaultTimeout) throw new AnthropicError("Streaming is strongly recommended for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-python#streaming-responses for more details");
		return defaultTimeout * 1e3;
	}
	/**
	* Used as a callback for mutating the given `FinalRequestOptions` object.
	*/
	async prepareOptions(options) {}
	/**
	* Used as a callback for mutating the given `RequestInit` object.
	*
	* This is useful for cases where you want to add certain headers based off of
	* the request properties, e.g. `method` or `url`.
	*/
	async prepareRequest(request, { url, options }) {}
	get(path$2, opts) {
		return this.methodRequest("get", path$2, opts);
	}
	post(path$2, opts) {
		return this.methodRequest("post", path$2, opts);
	}
	patch(path$2, opts) {
		return this.methodRequest("patch", path$2, opts);
	}
	put(path$2, opts) {
		return this.methodRequest("put", path$2, opts);
	}
	delete(path$2, opts) {
		return this.methodRequest("delete", path$2, opts);
	}
	methodRequest(method, path$2, opts) {
		return this.request(Promise.resolve(opts).then((opts$1) => {
			return {
				method,
				path: path$2,
				...opts$1
			};
		}));
	}
	request(options, remainingRetries = null) {
		return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
	}
	async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
		const options = await optionsInput;
		const maxRetries = options.maxRetries ?? this.maxRetries;
		if (retriesRemaining == null) retriesRemaining = maxRetries;
		await this.prepareOptions(options);
		const { req, url, timeout } = this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
		await this.prepareRequest(req, {
			url,
			options
		});
		/** Not an API request ID, just for correlating local log entries. */
		const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
		const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
		const startTime = Date.now();
		loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
			retryOfRequestLogID,
			method: options.method,
			url,
			options,
			headers: req.headers
		}));
		if (options.signal?.aborted) throw new APIUserAbortError();
		const controller = new AbortController();
		const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
		const headersTime = Date.now();
		if (response instanceof Error) {
			const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
			if (options.signal?.aborted) throw new APIUserAbortError();
			const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
			if (retriesRemaining) {
				loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url,
					durationMs: headersTime - startTime,
					message: response.message
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
			loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
				retryOfRequestLogID,
				url,
				durationMs: headersTime - startTime,
				message: response.message
			}));
			if (isTimeout) throw new APIConnectionTimeoutError();
			throw new APIConnectionError({ cause: response });
		}
		const specialHeaders = [...response.headers.entries()].filter(([name]) => name === "request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("");
		const responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
		if (!response.ok) {
			const shouldRetry = this.shouldRetry(response);
			if (retriesRemaining && shouldRetry) {
				const retryMessage$1 = `retrying, ${retriesRemaining} attempts remaining`;
				await CancelReadableStream(response.body);
				loggerFor(this).info(`${responseInfo} - ${retryMessage$1}`);
				loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage$1})`, formatRequestDetails({
					retryOfRequestLogID,
					url: response.url,
					status: response.status,
					headers: response.headers,
					durationMs: headersTime - startTime
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
			}
			const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
			loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
			const errText = await response.text().catch((err$1) => castToError(err$1).message);
			const errJSON = safeJSON(errText);
			const errMessage = errJSON ? void 0 : errText;
			loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url: response.url,
				status: response.status,
				headers: response.headers,
				message: errMessage,
				durationMs: Date.now() - startTime
			}));
			const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
			throw err;
		}
		loggerFor(this).info(responseInfo);
		loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
			retryOfRequestLogID,
			url: response.url,
			status: response.status,
			headers: response.headers,
			durationMs: headersTime - startTime
		}));
		return {
			response,
			options,
			controller,
			requestLogID,
			retryOfRequestLogID,
			startTime
		};
	}
	getAPIList(path$2, Page$1, opts) {
		return this.requestAPIList(Page$1, {
			method: "get",
			path: path$2,
			...opts
		});
	}
	requestAPIList(Page$1, options) {
		const request = this.makeRequest(options, null, void 0);
		return new PagePromise(this, request, Page$1);
	}
	async fetchWithTimeout(url, init, ms, controller) {
		const { signal, method,...options } = init || {};
		if (signal) signal.addEventListener("abort", () => controller.abort());
		const timeout = setTimeout(() => controller.abort(), ms);
		const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
		const fetchOptions = {
			signal: controller.signal,
			...isReadableBody ? { duplex: "half" } : {},
			method: "GET",
			...options
		};
		if (method) fetchOptions.method = method.toUpperCase();
		try {
			return await this.fetch.call(void 0, url, fetchOptions);
		} finally {
			clearTimeout(timeout);
		}
	}
	shouldRetry(response) {
		const shouldRetryHeader = response.headers.get("x-should-retry");
		if (shouldRetryHeader === "true") return true;
		if (shouldRetryHeader === "false") return false;
		if (response.status === 408) return true;
		if (response.status === 409) return true;
		if (response.status === 429) return true;
		if (response.status >= 500) return true;
		return false;
	}
	async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
		let timeoutMillis;
		const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
		if (retryAfterMillisHeader) {
			const timeoutMs = parseFloat(retryAfterMillisHeader);
			if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
		}
		const retryAfterHeader = responseHeaders?.get("retry-after");
		if (retryAfterHeader && !timeoutMillis) {
			const timeoutSeconds = parseFloat(retryAfterHeader);
			if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1e3;
			else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
		}
		if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
			const maxRetries = options.maxRetries ?? this.maxRetries;
			timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
		}
		await sleep(timeoutMillis);
		return this.makeRequest(options, retriesRemaining - 1, requestLogID);
	}
	calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
		const initialRetryDelay = .5;
		const maxRetryDelay = 8;
		const numRetries = maxRetries - retriesRemaining;
		const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
		const jitter = 1 - Math.random() * .25;
		return sleepSeconds * jitter * 1e3;
	}
	buildRequest(inputOptions, { retryCount = 0 } = {}) {
		const options = { ...inputOptions };
		const { method, path: path$2, query } = options;
		const url = this.buildURL(path$2, query);
		if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
		options.timeout = options.timeout ?? this.timeout;
		const { bodyHeaders, body } = this.buildBody({ options });
		const reqHeaders = this.buildHeaders({
			options: inputOptions,
			method,
			bodyHeaders,
			retryCount
		});
		const req = {
			method,
			headers: reqHeaders,
			...options.signal && { signal: options.signal },
			...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
			...body && { body },
			...this.fetchOptions ?? {},
			...options.fetchOptions ?? {}
		};
		return {
			req,
			url,
			timeout: options.timeout
		};
	}
	buildHeaders({ options, method, bodyHeaders, retryCount }) {
		let idempotencyHeaders = {};
		if (this.idempotencyHeader && method !== "get") {
			if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
			idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
		}
		const headers = buildHeaders([
			idempotencyHeaders,
			{
				Accept: "application/json",
				"User-Agent": this.getUserAgent(),
				"X-Stainless-Retry-Count": String(retryCount),
				...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
				...getPlatformHeaders(),
				...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
				"anthropic-version": "2023-06-01"
			},
			this.authHeaders(options),
			this._options.defaultHeaders,
			bodyHeaders,
			options.headers
		]);
		this.validateHeaders(headers);
		return headers.values;
	}
	buildBody({ options: { body, headers: rawHeaders } }) {
		if (!body) return {
			bodyHeaders: void 0,
			body: void 0
		};
		const headers = buildHeaders([rawHeaders]);
		if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream) return {
			bodyHeaders: void 0,
			body
		};
		else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) return {
			bodyHeaders: void 0,
			body: ReadableStreamFrom(body)
		};
		else return __classPrivateFieldGet(this, _BaseAnthropic_encoder, "f").call(this, {
			body,
			headers
		});
	}
};
_a = BaseAnthropic, _BaseAnthropic_encoder = new WeakMap();
BaseAnthropic.Anthropic = _a;
BaseAnthropic.HUMAN_PROMPT = "\n\nHuman:";
BaseAnthropic.AI_PROMPT = "\n\nAssistant:";
BaseAnthropic.DEFAULT_TIMEOUT = 6e5;
BaseAnthropic.AnthropicError = AnthropicError;
BaseAnthropic.APIError = APIError;
BaseAnthropic.APIConnectionError = APIConnectionError;
BaseAnthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
BaseAnthropic.APIUserAbortError = APIUserAbortError;
BaseAnthropic.NotFoundError = NotFoundError;
BaseAnthropic.ConflictError = ConflictError;
BaseAnthropic.RateLimitError = RateLimitError;
BaseAnthropic.BadRequestError = BadRequestError;
BaseAnthropic.AuthenticationError = AuthenticationError;
BaseAnthropic.InternalServerError = InternalServerError;
BaseAnthropic.PermissionDeniedError = PermissionDeniedError;
BaseAnthropic.UnprocessableEntityError = UnprocessableEntityError;
BaseAnthropic.toFile = toFile;
/**
* API Client for interfacing with the Anthropic API.
*/
var Anthropic = class extends BaseAnthropic {
	constructor() {
		super(...arguments);
		this.completions = new Completions(this);
		this.messages = new Messages(this);
		this.models = new Models(this);
		this.beta = new Beta(this);
	}
};
Anthropic.Completions = Completions;
Anthropic.Messages = Messages;
Anthropic.Models = Models;
Anthropic.Beta = Beta;
const { HUMAN_PROMPT, AI_PROMPT } = Anthropic;

//#endregion
//#region (ignored) node_modules/dotenv/lib
var require_lib = __commonJS({ "node_modules/dotenv/lib"() {} });

//#endregion
//#region node_modules/dotenv/package.json
var require_package = __commonJS({ "node_modules/dotenv/package.json"(exports, module) {
	module.exports = {
		"name": "dotenv",
		"version": "16.5.0",
		"description": "Loads environment variables from .env file",
		"main": "lib/main.js",
		"types": "lib/main.d.ts",
		"exports": {
			".": {
				"types": "./lib/main.d.ts",
				"require": "./lib/main.js",
				"default": "./lib/main.js"
			},
			"./config": "./config.js",
			"./config.js": "./config.js",
			"./lib/env-options": "./lib/env-options.js",
			"./lib/env-options.js": "./lib/env-options.js",
			"./lib/cli-options": "./lib/cli-options.js",
			"./lib/cli-options.js": "./lib/cli-options.js",
			"./package.json": "./package.json"
		},
		"scripts": {
			"dts-check": "tsc --project tests/types/tsconfig.json",
			"lint": "standard",
			"pretest": "npm run lint && npm run dts-check",
			"test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
			"test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
			"prerelease": "npm test",
			"release": "standard-version"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/motdotla/dotenv.git"
		},
		"homepage": "https://github.com/motdotla/dotenv#readme",
		"funding": "https://dotenvx.com",
		"keywords": [
			"dotenv",
			"env",
			".env",
			"environment",
			"variables",
			"config",
			"settings"
		],
		"readmeFilename": "README.md",
		"license": "BSD-2-Clause",
		"devDependencies": {
			"@types/node": "^18.11.3",
			"decache": "^4.6.2",
			"sinon": "^14.0.1",
			"standard": "^17.0.0",
			"standard-version": "^9.5.0",
			"tap": "^19.2.0",
			"typescript": "^4.8.4"
		},
		"engines": { "node": ">=12" },
		"browser": { "fs": false }
	};
} });

//#endregion
//#region node_modules/dotenv/lib/main.js
var require_main = __commonJS({ "node_modules/dotenv/lib/main.js"(exports, module) {
	const fs = require_lib();
	const path = __require("path");
	const os = __require("os");
	const crypto = __require("crypto");
	const packageJson = require_package();
	const version = packageJson.version;
	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		const vaultPath = _vaultPath(options);
		const result = DotenvModule.configDotenv({ path: vaultPath });
		if (!result.parsed) {
			const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const key = keys[i].trim();
			const attrs = _instructions(result, key);
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.log(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
		if (fs.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = Boolean(options && options.debug);
		if (debug) _debug("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		const debug = Boolean(options && options.debug);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path$2 of optionPaths) try {
			const parsed = DotenvModule.parse(fs.readFileSync(path$2, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path$2} ${e.message}`);
			lastError = e;
		}
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsedAll, options);
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		if (typeof parsed !== "object") {
			const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) processEnv[key] = parsed[key];
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else processEnv[key] = parsed[key];
	}
	const DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
} });

//#endregion
//#region src/use-ai.js
var import_main = __toESM(require_main());
import_main.default.config();
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
async function main() {
	const response = await ai.messages.create({
		model: "claude-3-5-haiku-20241022",
		max_tokens: 1e3,
		messages: [{
			role: "user",
			content: "Provide short example of a feedback to Pull Request - imagine that you are a reviewer."
		}]
	});
	console.log(response.content[0].text);
}
main();

//#endregion