import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const projectRoot = process.cwd()
const androidResDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res')
const publicDir = path.join(projectRoot, 'public')
const logoPath = path.join(publicDir, 'logo.png')
const black = { r: 0, g: 0, b: 0, alpha: 1 }
const transparent = { r: 0, g: 0, b: 0, alpha: 0 }

async function ensureFile(filePath) {
  await fs.access(filePath)
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

function createCanvas(width, height, background = black) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background,
    },
  })
}

async function renderContainedImage(buffer, width, height) {
  return sharp(buffer)
    .resize({
      width,
      height,
      fit: 'contain',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer()
}

async function writeCompositePng(outPath, { canvasWidth, canvasHeight, imageWidth, imageHeight, topOffset = 0, background = black }) {
  const logo = await fs.readFile(logoPath)
  const renderedLogo = await renderContainedImage(logo, imageWidth, imageHeight)

  const left = Math.max(0, Math.round((canvasWidth - imageWidth) / 2))
  const top = Math.max(0, Math.round((canvasHeight - imageHeight) / 2 + topOffset))

  await ensureDir(path.dirname(outPath))
  await createCanvas(canvasWidth, canvasHeight, background)
    .composite([
      {
        input: renderedLogo,
        left,
        top,
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath)
}

async function generateLauncherIcons() {
  const densities = [
    ['mipmap-mdpi', 48, 108],
    ['mipmap-hdpi', 72, 162],
    ['mipmap-xhdpi', 96, 216],
    ['mipmap-xxhdpi', 144, 324],
    ['mipmap-xxxhdpi', 192, 432],
  ]

  await Promise.all(
    densities.flatMap(([folder, iconSize, foregroundSize]) => {
      const dir = path.join(androidResDir, folder)
      return [
        writeCompositePng(path.join(dir, 'ic_launcher.png'), {
          canvasWidth: iconSize,
          canvasHeight: iconSize,
          imageWidth: Math.round(iconSize * 0.88),
          imageHeight: Math.round(iconSize * 0.88),
          background: black,
        }),
        writeCompositePng(path.join(dir, 'ic_launcher_round.png'), {
          canvasWidth: iconSize,
          canvasHeight: iconSize,
          imageWidth: Math.round(iconSize * 0.88),
          imageHeight: Math.round(iconSize * 0.88),
          background: black,
        }),
        writeCompositePng(path.join(dir, 'ic_launcher_foreground.png'), {
          canvasWidth: foregroundSize,
          canvasHeight: foregroundSize,
          imageWidth: Math.round(foregroundSize * 0.82),
          imageHeight: Math.round(foregroundSize * 0.82),
          background: transparent,
        }),
      ]
    })
  )
}

async function generateSplashImages() {
  const portrait = [
    ['drawable-port-mdpi', 320, 480],
    ['drawable-port-hdpi', 480, 800],
    ['drawable-port-xhdpi', 720, 1280],
    ['drawable-port-xxhdpi', 960, 1600],
    ['drawable-port-xxxhdpi', 1280, 1920],
  ]

  const landscape = [
    ['drawable-land-mdpi', 480, 320],
    ['drawable-land-hdpi', 800, 480],
    ['drawable-land-xhdpi', 1280, 720],
    ['drawable-land-xxhdpi', 1600, 960],
    ['drawable-land-xxxhdpi', 1920, 1280],
  ]

  const generic = [['drawable', 1280, 1920]]

  const jobs = [
    ...portrait.map(([folder, width, height]) =>
      writeCompositePng(path.join(androidResDir, folder, 'splash.png'), {
        canvasWidth: width,
        canvasHeight: height,
        imageWidth: Math.round(width * 0.62),
        imageHeight: Math.round(height * 0.28),
        topOffset: Math.round(height * -0.08),
        background: black,
      })
    ),
    ...landscape.map(([folder, width, height]) =>
      writeCompositePng(path.join(androidResDir, folder, 'splash.png'), {
        canvasWidth: width,
        canvasHeight: height,
        imageWidth: Math.round(width * 0.32),
        imageHeight: Math.round(height * 0.62),
        topOffset: Math.round(height * -0.08),
        background: black,
      })
    ),
    ...generic.map(([folder, width, height]) =>
      writeCompositePng(path.join(androidResDir, folder, 'splash.png'), {
        canvasWidth: width,
        canvasHeight: height,
        imageWidth: Math.round(width * 0.62),
        imageHeight: Math.round(height * 0.28),
        topOffset: Math.round(height * -0.08),
        background: black,
      })
    ),
  ]

  await Promise.all(jobs)
}

async function main() {
  await ensureFile(logoPath)
  await generateLauncherIcons()
  await generateSplashImages()
  console.log('Assets Android do Capacitor gerados com sucesso.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
