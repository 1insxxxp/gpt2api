const BRAND_NAME = 'Passion AI'
const SEPARATOR = '·'

export interface BrandParts {
  brand: string
  sep: string
}

export function brandParts(): BrandParts {
  return {
    brand: BRAND_NAME,
    sep: SEPARATOR,
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
