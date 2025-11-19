#!/usr/bin/env node
/**
 * Extract balance parameters from a game using the coding agent
 *
 * Usage: node scripts/extract_balance_params.js --slug <slug>
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  if (!opts.slug) {
    throw new Error('Expected --slug <slug>');
  }
  return opts;
}

function main() {
  const argv = process.argv.slice(2);
  let options;

  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    console.error('Usage: node scripts/extract_balance_params.js --slug <slug>');
    process.exit(1);
  }

  const ROOT = path.join(__dirname, '..');
  const prototypeDir = path.join(ROOT, 'tmp', 'prototypes', options.slug);
  const gamePath = path.join(prototypeDir, 'game.js');
  const promptDir = path.join(ROOT, 'tmp', 'prompts');
  const promptPath = path.join(promptDir, `extract_params_${options.slug}.md`);
  const outputPath = path.join(prototypeDir, 'balance_params.json');

  // Check if game exists
  if (!fs.existsSync(gamePath)) {
    console.error(`Game file not found: ${gamePath}`);
    process.exit(1);
  }

  // Read game code
  const gameCode = fs.readFileSync(gamePath, 'utf8');

  // Create prompt for agent
  fs.mkdirSync(promptDir, { recursive: true });

  const prompt = `# パラメータ抽出タスク

## 目的
以下のゲームコードからゲームバランス調整可能なパラメータを抽出し、JSON形式で出力してください。

## 対象ゲーム
- Slug: ${options.slug}
- Path: ${gamePath}

## 抽出基準

### 優先度 High（必ず抽出）
- **難易度パラメータ**: 速度、重力、加速度、difficulty係数、スコア係数
- **プレイヤー操作**: ジャンプ力（hop値）、移動速度、回転速度、angularVel
- **敵/障害物**: 出現間隔（nextEnemyTicks, nextObstacleTicks）、速度パラメータ

### 優先度 Medium（関連性がある場合）
- 初期化時の定数値（update内のマジックナンバー）
- タイミング関連（フレーム数、遅延）
- サイズ・範囲パラメータ

### 除外
- 座標値（初期位置など、バランスに影響しないもの）
- 表示関連のみのパラメータ（色、viewSizeなど）

## ゲームコード

\`\`\`javascript
${gameCode}
\`\`\`

## 出力形式

以下のJSON形式で \`${outputPath}\` に出力してください：

\`\`\`json
{
  "gameSlug": "${options.slug}",
  "extractedAt": "ISO8601形式の日時",
  "parameters": [
    {
      "path": "変数パス（例: buggy.hop.y）",
      "currentValue": 現在の値,
      "suggestedMin": 推奨最小値,
      "suggestedMax": 推奨最大値,
      "description": "パラメータの説明（日本語）",
      "balanceImpact": "high / medium / low",
      "location": "line 行番号"
    }
  ]
}
\`\`\`

## 注意事項
- pathは実際のコード構造を反映（例: \`buggy.hop.y\` は \`buggy = { hop: { y: -3 } }\` に対応）
- suggestedMin/Maxは現在値から妥当な範囲を推定（通常は現在値の50%-200%程度）
- balanceImpactは、変更したときのゲームバランスへの影響度
- 重複を避け、実際に調整可能なパラメータのみを抽出

## 実行手順
1. 上記のゲームコードを分析
2. 抽出基準に基づきパラメータをリストアップ
3. JSON形式で出力ファイルに保存
`;

  fs.writeFileSync(promptPath, prompt, 'utf8');

  console.log(`
====================================
パラメータ抽出タスクを生成しました
====================================

プロンプトファイル: ${promptPath}
出力先: ${outputPath}

次のステップ:
1. エージェントが上記プロンプトに従ってパラメータを抽出します
2. 結果を ${outputPath} に保存します
3. ユーザーが内容を確認・承認します
4. npm run balance-game でバランス調整を実行できます

エージェント実行待ち...
`);
}

main();
