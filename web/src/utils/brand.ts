// Brand footer fragments are decoded in the browser at runtime.

const _K = new Uint8Array([0x4f, 0x17, 0x9a, 0x3b])

// 解码:Base64 → XOR → UTF-8
function _d(enc: string): string {
  const bin = atob(enc)
  const u = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i) ^ _K[i % _K.length]
  return new TextDecoder('utf-8').decode(u)
}

// 预计算片段(XOR-key=0x4F17 9A3B, Base64)
const _F = {
  BRAND: 'CEfOCQ5H0w==',
  SEP: 'b9UtGw==',
}

// 缓存
let _cache: Record<string, string> | null = null
function _all(): Record<string, string> {
  if (_cache) return _cache
  const out: Record<string, string> = {}
  for (const k of Object.keys(_F)) out[k] = _d((_F as Record<string, string>)[k])
  _cache = out
  return out
}

export interface BrandParts {
  brand: string
  sep: string
}

export function brandParts(): BrandParts {
  const p = _all()
  return {
    brand: p.BRAND,
    sep: p.SEP,
  }
}

// 纯文本广告(console 水印 / 老浏览器回退)
export function brandPlainText(): string {
  const p = brandParts()
  return p.brand
}

// 控制台水印:启动一次,顺带多一处署名
let _warned = false
export function printBrandToConsole(): void {
  if (_warned) return
  _warned = true
  try {
    const p = brandParts()
    // eslint-disable-next-line no-console
    console.log(
      `%c${p.brand}`,
      'font-weight:700;color:#409eff;font-size:13px;',
    )
  } catch {
    /* ignore */
  }
}

export function startBrandGuard(): void {
  // No-op: external promotional links are intentionally disabled.
}
