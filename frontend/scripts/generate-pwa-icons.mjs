import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function loadBaseSvg() {
  const svgPath = path.join(publicDir, 'appwrite.svg')
  if (!(await fileExists(svgPath))) {
    throw new Error(
      `Não achei ${svgPath}. Coloque um SVG base em public/appwrite.svg ou ajuste o script.`
    )
  }
  return fs.readFile(svgPath)
}

async function loadBaseImage() {
  const pngPath = path.join(publicDir, 'logo.png')
  if (await fileExists(pngPath)) return fs.readFile(pngPath)
  return loadBaseSvg()
}

async function writePng(outFileName, size, { padding = 0, background = { r: 250, g: 250, b: 251, alpha: 1 } } = {}) {
  const base = await loadBaseImage()

  
  const png = await sharp(base, { density: 512 })
    .resize({
      width: size - padding * 2,
      height: size - padding * 2,
      fit: 'contain',
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background,
    })
    .resize({ width: size, height: size, fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer()

  await fs.writeFile(path.join(publicDir, outFileName), png)
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })

  await writePng('pwa-192x192.png', 192, { padding: 16 })
  await writePng('pwa-512x512.png', 512, { padding: 48 })
  // maskable: menos padding para preencher melhor
  await writePng('pwa-512x512-maskable.png', 512, { padding: 16 })
  await writePng('apple-touch-icon.png', 180, { padding: 16 })

  // Log simples (útil em CI/local)
  // eslint-disable-next-line no-console
  console.log('Ícones PWA gerados em /public')
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
