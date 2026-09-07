// Partner logos arrive as SVGs on a square 1080×1080 canvas with the artwork
// floating in the middle. Crop each one to its artwork, drop the fixed size so
// <img> can scale it, shrink any embedded raster, and write it to
// public/img/partners/<slug>.svg. Needs ImageMagick (`convert`) on the PATH.
//
//   node scripts/crop-logos.mjs            # reads ../img/partners/*.svg
//
// Then list the slug in src/content/facts.ts (PARTNERS or SPONSORS).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = join(here, '..', '..', 'img', 'partners')
const OUT = join(here, '..', 'public', 'img', 'partners')
const TMP = join(tmpdir(), 'mt-logos')
mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })

/* Files whose name does not say what they are. Everything else is slugified. */
const RENAME = {
  'myactuator copy 3.svg': 'k-silver.svg',
  'myactuator copy 4.svg': 'prolink.svg',
  'myactuator copy 5.svg': 'logitech.svg',
  'Turkish.svg': 'turkish-airlines.svg',
  'nyntaxx.svg': 'nyntax.svg',
}

const slug = (name) =>
  RENAME[name] ??
  name
    .toLowerCase()
    .replace(/\s+color(?=\.svg$)/, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+\.svg$/, '.svg')

function trimBox(file) {
  const out = execSync(`convert -background white "${file}" -flatten -format '%@' info:`, { encoding: 'utf8' }).trim()
  const m = out.match(/^(\d+)x(\d+)\+(\d+)\+(\d+)$/)
  if (!m) throw new Error(`could not measure ${file}: ${out}`)
  return { w: +m[1], h: +m[2], x: +m[3], y: +m[4] }
}

function shrinkRasters(svg, name) {
  let n = 0
  return svg.replace(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g, (_, b64) => {
    const png = join(TMP, `${name}-${n}.png`)
    const small = join(TMP, `${name}-${n}-small.png`)
    n++
    writeFileSync(png, Buffer.from(b64, 'base64'))
    execSync(`convert "${png}" -resize 480x480\\> -strip "${small}"`) // 4× what a logo needs on the 1920 stage
    return 'data:image/png;base64,' + readFileSync(small).toString('base64')
  })
}

for (const name of readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.svg'))) {
  const file = join(SRC, name)
  const box = trimBox(file)
  const pad = Math.max(10, Math.round(box.w * 0.025))
  const vb = `${box.x - pad} ${box.y - pad} ${box.w + 2 * pad} ${box.h + 2 * pad}`
  let svg = readFileSync(file, 'utf8')
  const rootRe = /<svg\b[^>]*>/
  const root = svg.match(rootRe)
  if (!root) throw new Error(`no <svg> root in ${name}`)
  const tag = root[0]
    .replace(/\sviewBox="[^"]*"/, '')
    .replace(/\swidth="[^"]*"/, '')
    .replace(/\sheight="[^"]*"/, '')
    .replace(/^<svg/, `<svg viewBox="${vb}"`)
  const to = slug(name)
  svg = shrinkRasters(svg.replace(rootRe, tag), to.replace(/\.svg$/, ''))
  const out = join(OUT, to)
  writeFileSync(out, svg)
  console.log(`${name.padEnd(24)} -> ${to.padEnd(22)} ${(statSync(file).size / 1024).toFixed(0)}k -> ${(statSync(out).size / 1024).toFixed(0)}k`)
}
