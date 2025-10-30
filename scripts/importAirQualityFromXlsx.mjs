import fs from 'node:fs/promises';
import path from 'node:path';
import xlsx from 'xlsx';

const projectRoot = process.cwd();
const stationsPath = path.join(projectRoot, 'public', 'data', 'stations_with_coords.json');
const outputPath = path.join(projectRoot, 'public', 'data', 'air-quality.json');

/**
 * 현재 시각(KST)에서 1년 전 날짜/시간을 계산하고, 시간을 정시로 맞춥니다.
 * 예: 2025/10/31 07:30 → 2024/10/31 07:00
 */
function getTargetDateTimeForLookup() {
  const nowKst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const targetDate = new Date(nowKst);
  targetDate.setFullYear(targetDate.getFullYear() - 1);
  const hour = targetDate.getHours();
  return {
    year: targetDate.getFullYear(),
    month: targetDate.getMonth() + 1,
    day: targetDate.getDate(),
    hour,
    // 엑셀 측정일시 형식: YYYYMMDDHH (정수)
    datetimeInt: parseInt(
      `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, '0')}${String(targetDate.getDate()).padStart(2, '0')}${String(hour).padStart(2, '0')}`,
      10
    ),
    // dataTime 형식: YYYY-MM-DD HH:00
    dataTimeStr: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`,
  };
}

async function main() {
  // 측정소 목록 로드
  const stationsRaw = await fs.readFile(stationsPath, 'utf8');
  const stations = JSON.parse(stationsRaw);
  const stationNames = new Set(Object.keys(stations.data || {}));

  if (stationNames.size === 0) {
    console.error('stations_with_coords.json에서 측정소명을 찾을 수 없습니다.');
    process.exit(1);
  }

  // 목표 시각 결정 (1년 전 현재 시각의 정시)
  const target = getTargetDateTimeForLookup();
  
  // 엑셀 파일 경로 결정 (2024_MM.xlsx)
  const excelPath = path.join(projectRoot, 'public', 'data', `${target.year}_${String(target.month).padStart(2, '0')}.xlsx`);

  try {
    await fs.access(excelPath);
  } catch {
    console.error(`파일을 찾을 수 없습니다: ${excelPath}`);
    console.error(`현재 조회 시각: ${target.dataTimeStr}, 필요한 파일: ${target.year}_${String(target.month).padStart(2, '0')}.xlsx`);
    process.exit(1);
  }

  // 엑셀 로드
  console.log(`Loading: ${excelPath}`);
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

  if (rows.length === 0) {
    console.error('엑셀 파일이 비어있습니다.');
    process.exit(1);
  }

  const header = rows[0];
  const idxStationName = header.indexOf('측정소명');
  const idxDatetime = header.indexOf('측정일시');
  const idxPM10 = header.indexOf('PM10');
  const idxPM25 = header.indexOf('PM25');

  if (idxStationName < 0 || idxDatetime < 0 || idxPM10 < 0 || idxPM25 < 0) {
    console.error('필수 컬럼을 찾을 수 없습니다:', { idxStationName, idxDatetime, idxPM10, idxPM25 });
    process.exit(1);
  }

  console.log(`Target lookup: ${target.dataTimeStr} (엑셀 측정일시: ${target.datetimeInt})`);

  // 측정소별로 가장 최근 데이터 찾기 (목표 시각 이하 중 최대값)
  const stationData = new Map(); // stationName -> { datetimeInt, pm10, pm25 }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const stationName = row[idxStationName];
    if (!stationNames.has(stationName)) continue;

    const datetimeInt = typeof row[idxDatetime] === 'number' ? row[idxDatetime] : parseInt(row[idxDatetime], 10);
    if (isNaN(datetimeInt)) continue;

    // 목표 시각 이하의 데이터만 고려
    if (datetimeInt > target.datetimeInt) continue;

    const pm10 = typeof row[idxPM10] === 'number' ? row[idxPM10] : parseFloat(row[idxPM10]);
    const pm25 = typeof row[idxPM25] === 'number' ? row[idxPM25] : parseFloat(row[idxPM25]);

    const existing = stationData.get(stationName);
    if (!existing || datetimeInt > existing.datetimeInt) {
      stationData.set(stationName, {
        datetimeInt,
        pm10: Number.isFinite(pm10) ? Math.round(pm10) : null,
        pm25: Number.isFinite(pm25) ? Math.round(pm25) : null,
      });
    }
  }

  // 결과 구성
  const results = {};
  for (const stationName of stationNames) {
    const found = stationData.get(stationName);
    if (found) {
      results[stationName] = {
        pm10: found.pm10,
        pm25: found.pm25,
        dataTime: target.dataTimeStr,
      };
    } else {
      results[stationName] = {
        pm10: null,
        pm25: null,
        dataTime: null,
        error: `No data found for ${target.dataTimeStr}`,
      };
    }
  }

  // 출력
  const output = {
    updatedAt: new Date().toISOString(),
    count: Object.keys(results).length,
    data: results,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`Saved air quality for ${output.count} stations -> ${path.relative(projectRoot, outputPath)}`);

  // 요약 통계
  const withData = Object.values(results).filter((r) => r.pm10 !== null && r.pm25 !== null).length;
  const withoutData = output.count - withData;
  console.log(`Summary: ${withData} stations with data, ${withoutData} stations without data`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

