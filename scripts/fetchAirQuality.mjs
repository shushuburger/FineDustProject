import fs from 'node:fs/promises'
import path from 'node:path'

const SERVICE_KEY_RAW = process.env.SERVICE_KEY?.trim()
const SERVICE_KEY = SERVICE_KEY_RAW?.includes('%') ? decodeURIComponent(SERVICE_KEY_RAW) : SERVICE_KEY_RAW
if (!SERVICE_KEY) {
  console.error('환경변수 SERVICE_KEY가 필요합니다. GitHub Actions 시크릿으로 설정하세요.')
  process.exit(1)
}

// 입력/출력 경로
const projectRoot = process.cwd()
// 대전 측정소 좌표 파일의 키들을 요청 대상으로 사용
const stationListPath = path.join(projectRoot, 'public', 'data', 'stations_with_coords.json')
const outputPath = path.join(projectRoot, 'public', 'data', 'air-quality.json')

// OpenAPI 엔드포인트 (측정소별 실시간 측정정보 조회)
const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
const VERBOSE = process.env.VERBOSE === '1'

// 간단한 sleep
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

function buildUrl(stationName) {
  const url = new URL(BASE_URL)
  url.searchParams.set('serviceKey', SERVICE_KEY)
  url.searchParams.set('returnType', 'json')
  url.searchParams.set('numOfRows', '1')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('stationName', stationName)
  url.searchParams.set('dataTerm', 'DAILY')
  // 1.3 스키마가 더 최신이며 자료 필드 일관성이 좋음
  url.searchParams.set('ver', '1.3')
  return url.toString()
}

function parseItem(json) {
  // 응답 스키마: { response: { body: { items: [ { pm10Value, pm25Value, dataTime, ... } ] } } }
  const item = json?.response?.body?.items?.[0]
  if (!item) return null
  const pm10 = toNumberOrNull(item.pm10Value)
  const pm25 = toNumberOrNull(item.pm25Value)
  return { pm10, pm25, dataTime: item.dataTime ?? null }
}

function toNumberOrNull(v) {
  if (v === null || v === undefined) return null
  if (v === '-' || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

async function fetchStation(stationName) {
  const url = buildUrl(stationName)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetchWithTimeout(url, {}, 12000)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const parsed = parseItem(json)
      if (parsed) return parsed
      // 항목이 비어있는 경우 헤더의 코드/메시지를 에러로 기록
      const header = json?.response?.header
      const code = header?.resultCode
      const msg = header?.resultMsg
      const details = code || msg ? `noItems resultCode=${code} resultMsg=${msg}` : 'noItems'
      throw new Error(details)
    } catch (err) {
      if (VERBOSE) console.warn(`[warn] ${stationName} attempt ${attempt}: ${String(err?.message || err)}`)
      if (attempt === 3) throw err
      // 점진 대기 후 재시도
      await sleep(250 * attempt)
    }
  }
}

async function main() {
  // KST(Asia/Seoul) 기준 05:00~20:59에만 실행 (그 외 시간 건너뜀)
  const nowSeoul = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  const kstHour = nowSeoul.getHours()
  const inDayWindow = kstHour >= 5 && kstHour <= 20
  if (!inDayWindow) {
    console.log('KST 05:00~20:59에만 수집합니다. 현재 시각(KST):', nowSeoul.toISOString())
    return
  }

  const raw = await fs.readFile(stationListPath, 'utf8')
  const coords = JSON.parse(raw)
  /** @type {string[]} */
  const stations = Object.keys(coords?.data || {})
  if (stations.length === 0) {
    console.error('stations_with_coords.json에서 측정소명을 찾지 못했습니다. data 키를 확인하세요.')
    process.exit(1)
  }
  console.log(`Using ${stations.length} Daejeon stations from stations_with_coords.json`)

  const concurrency = 8
  const queue = [...stations]
  const results = {}
  let processed = 0

  async function worker() {
    while (queue.length) {
      const name = queue.shift()
      try {
        const data = await fetchStation(name)
        results[name] = data
        if (VERBOSE) console.log(`[ok] ${name} ->`, data)
      } catch (e) {
        const errMsg = String(e?.message || e)
        results[name] = { pm10: null, pm25: null, dataTime: null, error: errMsg }
        console.error(`[error] ${name}: ${errMsg}`)
      }
      processed += 1
      // API 과부하 방지 소폭 대기
      await sleep(50)
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)

  const output = {
    updatedAt: new Date().toISOString(),
    count: Object.keys(results).length,
    data: results
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const jsonText = JSON.stringify(output, null, 2)

  // 기존 파일과 비교하여 변경 없으면 그대로 종료
  let changed = true
  try {
    const prev = await fs.readFile(outputPath, 'utf8')
    changed = prev !== jsonText
  } catch {}

  await fs.writeFile(outputPath, jsonText, 'utf8')
  console.log(`Saved air quality for ${output.count} stations -> ${path.relative(projectRoot, outputPath)}`)
  if (!changed) {
    console.log('No changes detected compared to previous output.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


