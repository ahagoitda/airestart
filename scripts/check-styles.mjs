// 문체 카탈로그 동기화 검증:
// lib/styles.ts (클라이언트 라벨)와 server/lib/styles.ts (작풍 가이드)의 키 일치 + 80종 확인
// 실행: node --experimental-strip-types scripts/check-styles.mjs

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const client = await import(path.join(root, 'lib/styles.ts'));
const server = await import(path.join(root, 'server/lib/styles.ts'));

const clientKeys = new Set(client.ALL_STYLES.map((s) => s.value));
const serverKeys = new Set(Object.keys(server.STYLE_GUIDES));

let errors = 0;

if (client.ALL_STYLES.length !== clientKeys.size) {
  console.error('클라이언트 카탈로그에 중복 키가 있습니다.');
  errors++;
}
if (clientKeys.size !== 80) {
  console.error(`카테고리 수가 80이 아닙니다: ${clientKeys.size}`);
  errors++;
}
for (const k of clientKeys) {
  if (!serverKeys.has(k)) {
    console.error(`서버 가이드 누락: ${k}`);
    errors++;
  }
}
for (const k of serverKeys) {
  if (!clientKeys.has(k)) {
    console.error(`클라이언트 라벨 누락: ${k}`);
    errors++;
  }
}
if (client.DEFAULT_STYLE !== server.DEFAULT_STYLE || !clientKeys.has(client.DEFAULT_STYLE)) {
  console.error('DEFAULT_STYLE 불일치 또는 카탈로그에 없음');
  errors++;
}
for (const s of client.ALL_STYLES) {
  if (!s.label?.trim() || !s.description?.trim()) {
    console.error(`라벨/설명 비어 있음: ${s.value}`);
    errors++;
  }
}
for (const [k, v] of Object.entries(server.STYLE_GUIDES)) {
  if (!v.label?.trim() || !v.guide?.trim()) {
    console.error(`서버 가이드 비어 있음: ${k}`);
    errors++;
  }
}

if (errors === 0) {
  console.log(`STYLES_OK (${clientKeys.size}종)`);
} else {
  console.error(`오류 ${errors}건`);
  process.exit(1);
}
