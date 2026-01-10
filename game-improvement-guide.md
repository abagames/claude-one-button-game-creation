# ワンボタンゲーム改善ガイド

シミュレーションログを分析し、パラメータ調整に留まらない根本的なゲーム改善を行うためのガイド。

## 重要: 評価の主要指標は GA 比率

**GA スコア / 単調最高スコア** の比率で評価する。絶対値（10 点、50 点など）は使用しない。

- **GA 比率 ≤ 1.0**: 不合格（単調入力が最適解）
- **GA 比率 > 1.5**: 合格（スキル入力が報われる）

生存時間は評価基準に含まない。スコアが入らなければ長時間生存しても問題ない。

## 1. 本ガイドの目的

`scripts/ga_tester.js --verbose` が出力する **GA 最適化パターンでのシミュレーションログ** を分析し、以下を達成する：

- **問題の根本原因特定**: 表面的な症状ではなく、設計上の欠陥を特定
- **構造的改善提案**: パラメータ調整ではなく、ルール・ロジックの変更を提案
- **フィールド生成の最適化**: 障害物・敵・地形の動的生成アルゴリズムを改善

## 2. ログ分析の観点

**重要**: 分析対象は **GA 最適化パターンの詳細ログ**（`ga.detailedLog`）である。単調入力（NoInput、HoldOnly、SpamPress）のログは分析に使用しない。単調入力は「不適切なプレイ」を表すため、その死因や入力パターンを分析しても改善に繋がらない。

### 2.1 死因分析（Death Analysis）

ログの `ga.detailedLog.deathAnalysis` セクションから以下を読み取る：

| 指標                   | 問題の兆候                             | 根本原因の可能性                       |
| :--------------------- | :------------------------------------- | :------------------------------------- |
| 同一位置での死亡が多い | 特定座標に死亡が集中                   | 回避不能な配置パターン、安全地帯の欠如 |
| 衝突直前の速度が高い   | `approachAnalysis.playerVelocity` が大 | 反応時間不足、減速手段の欠如           |
| 入力直後の死亡         | 入力から 1-3 フレームで死亡            | 入力遅延、先読み不可能な配置           |
| 特定障害物種への偏り   | `collidedWith` が単一種に集中          | その障害物の挙動設計に問題             |

### 2.2 スポーン分析（Spawn Analysis）

ログの `ga.detailedLog.spawnAnalysis` セクションから以下を読み取る：

| 指標                               | 問題の兆候                 | 根本原因の可能性               |
| :--------------------------------- | :------------------------- | :----------------------------- |
| `minInterval` が極端に小さい       | 連続スポーンによる回避不能 | 間隔制御ロジックの欠陥         |
| `spatialDistribution` が偏っている | 特定領域にのみ出現         | 乱数シードまたは生成範囲の問題 |
| `spawnTypes` の分布が不均一        | 単一種が支配的             | 種別選択ロジックの偏り         |

### 2.3 スコアリング分析（Scoring Analysis）

ログの `ga.detailedLog.scoringAnalysis` セクションから以下を読み取る：

| 指標                             | 問題の兆候                     | 根本原因の可能性                 |
| :------------------------------- | :----------------------------- | :------------------------------- |
| `triggers` が単一                | スコア獲得手段が限定的         | リスク・リワードの多様性欠如     |
| `scoringRate` が時間と無相関     | 生存時間がスコアに反映されない | 時間ベース報酬の欠如             |
| `averageScore` が極端に低い/高い | バランス崩壊                   | 得点倍率または獲得機会の設計問題 |

### 2.4 入力分析（Input Analysis）

ログの `ga.detailedLog.inputAnalysis` セクションから以下を読み取る：

| 指標                     | 問題の兆候               | 根本原因の可能性                  |
| :----------------------- | :----------------------- | :-------------------------------- |
| `pattern: "spam"`        | 連打が最適解             | 入力に対するペナルティ欠如        |
| `pattern: "hold_heavy"`  | 長押しが最適解           | 長押しに対する制約欠如            |
| `maxHoldDuration` が極端 | 長押し時間のバランス問題 | 長押しメカニクスの報酬/リスク設計 |

## 3. 問題パターンと根本的解決策

### 3.1 回避不能配置（Unavoidable Patterns）

**症状**:

- 特定位置での死亡が集中
- ニアミス（`nearMisses`）がゼロまたは極端に少ない
- 死亡直前フレームで入力しても回避不能

**パラメータ調整（不十分）**:

```javascript
// ❌ 単なる速度調整
obstacleSpeed = obstacleSpeed * 0.8;
```

**根本的解決**:

```javascript
// ✅ 配置ロジックの改善：安全経路の保証
function spawnObstacle() {
  // 既存障害物との距離を確認
  const safeDistance = playerSpeed * reactionFrames;
  let pos;
  let attempts = 0;

  do {
    pos = generateRandomPosition();
    attempts++;
  } while (!hasEscapeRoute(pos, safeDistance) && attempts < maxAttempts);

  // 安全経路がない場合はスポーンをスキップ
  if (attempts >= maxAttempts) return null;

  return createObstacle(pos);
}

// 安全経路の検証
function hasEscapeRoute(obstaclePos, minGap) {
  const playerY = player.pos.y;
  const escapeZones = [
    { min: 0, max: obstaclePos.y - minGap },
    { min: obstaclePos.y + obstacleSize + minGap, max: screenHeight },
  ];

  return escapeZones.some(
    (zone) =>
      zone.max - zone.min >= playerSize &&
      isReachable(playerY, zone, availableFrames)
  );
}
```

### 3.2 単調入力の優位性（Monotonous Input Dominance）

**症状**:

- `inputAnalysis.pattern` が "spam" または "hold_heavy"
- 単調入力パターンでも高スコア達成可能

**パラメータ調整（不十分）**:

```javascript
// ❌ 単なるクールダウン追加
if (inputCooldown > 0) return;
inputCooldown = 10;
```

**根本的解決**:

```javascript
// ✅ 入力リズムに基づくルール変更
const inputHistory = [];
const RHYTHM_WINDOW = 60; // 1秒間の入力履歴

function processInput() {
  inputHistory.push({ tick: ticks, pressed: input.isJustPressed });

  // 古い履歴を削除
  while (
    inputHistory.length > 0 &&
    inputHistory[0].tick < ticks - RHYTHM_WINDOW
  ) {
    inputHistory.shift();
  }

  // 入力パターンを分析
  const pattern = analyzePattern(inputHistory);

  if (pattern === "spam") {
    // 連打にペナルティ：入力効果を減衰
    inputEffectiveness *= 0.5;
    // または環境を厳しくする
    spawnHostileObstacle();
  } else if (pattern === "rhythmic") {
    // リズミカルな入力にボーナス
    addScore(bonusPoints);
    // または有利な環境を生成
    spawnPowerUp();
  }
}

function analyzePattern(history) {
  const intervals = [];
  for (let i = 1; i < history.length; i++) {
    if (history[i].pressed && history[i - 1].pressed) {
      intervals.push(history[i].tick - history[i - 1].tick);
    }
  }

  if (intervals.length < 3) return "varied";

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
    intervals.length;

  if (avgInterval < 5) return "spam";
  if (Math.sqrt(variance) < avgInterval * 0.3) return "rhythmic";
  return "varied";
}
```

### 3.3 難易度曲線の欠如（Flat Difficulty Curve）

**症状**:

- `scoringAnalysis.scoringRate` が時間に対して一定
- 長時間生存してもゲーム体験が変化しない
- `spawnAnalysis.averageInterval` が一定

**パラメータ調整（不十分）**:

```javascript
// ❌ 単なる線形難易度上昇
spawnInterval = baseInterval - ticks / 100;
```

**根本的解決**:

```javascript
// ✅ フェーズベースの難易度システム
const PHASES = [
  {
    name: "tutorial",
    duration: 300, // 5秒
    rules: {
      obstacleTypes: ["slow_block"],
      spawnPattern: "single",
      safeZoneSize: 0.4, // 画面の40%
    },
  },
  {
    name: "ramp_up",
    duration: 600,
    rules: {
      obstacleTypes: ["slow_block", "fast_block"],
      spawnPattern: "pair",
      safeZoneSize: 0.3,
    },
  },
  {
    name: "challenge",
    duration: Infinity,
    rules: {
      obstacleTypes: ["slow_block", "fast_block", "homing"],
      spawnPattern: "wave",
      safeZoneSize: 0.2,
      // 新しいメカニクスを導入
      newMechanic: "screen_shake_warning",
    },
  },
];

function getCurrentPhase() {
  let elapsed = 0;
  for (const phase of PHASES) {
    elapsed += phase.duration;
    if (ticks < elapsed) return phase;
  }
  return PHASES[PHASES.length - 1];
}

function spawnObstacle() {
  const phase = getCurrentPhase();
  const rules = phase.rules;

  // フェーズに応じた障害物タイプを選択
  const type = rules.obstacleTypes[rndi(0, rules.obstacleTypes.length)];

  // フェーズに応じたスポーンパターンを適用
  switch (rules.spawnPattern) {
    case "single":
      return [createObstacle(type)];
    case "pair":
      return createPairWithGap(type, rules.safeZoneSize);
    case "wave":
      return createWavePattern(type, rules.safeZoneSize);
  }
}
```

### 3.4 視覚的予告の欠如（Lack of Visual Telegraphing）

**症状**:

- `deathAnalysis.recentFrames` で障害物が急に出現
- ニアミス後すぐに死亡（予測困難）

**パラメータ調整（不十分）**:

```javascript
// ❌ 単なる画面外からの出現
obstacle.x = screenWidth + obstacleSize;
```

**根本的解決**:

```javascript
// ✅ 予告システムの実装
class Obstacle {
  constructor(targetPos, warningDuration = 30) {
    this.state = "warning";
    this.targetPos = targetPos;
    this.warningTicks = warningDuration;
    this.pos = { ...targetPos };
    this.alpha = 0.3; // 半透明で予告
  }

  update() {
    if (this.state === "warning") {
      this.warningTicks--;
      // 警告中は点滅
      this.alpha = 0.3 + 0.2 * Math.sin(ticks * 0.5);

      if (this.warningTicks <= 0) {
        this.state = "active";
        this.alpha = 1.0;
        // 警告終了時に効果音
        play("warning_end");
      }

      // 警告中は当たり判定なし
      return { collision: false };
    }

    // アクティブ状態では通常の挙動
    return this.normalUpdate();
  }

  draw() {
    if (this.state === "warning") {
      // 警告表示：点線の外枠
      color("light_red");
      // 点滅するアウトライン
      if (Math.floor(ticks / 4) % 2 === 0) {
        rect(this.pos.x - 1, this.pos.y - 1, this.size + 2, this.size + 2);
      }
    }

    color(this.state === "warning" ? "light_red" : "red");
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}
```

### 3.5 空間利用の偏り（Spatial Utilization Bias）

**症状**:

- `spawnAnalysis.spatialDistribution` が特定範囲に集中
- `spatialData.deathPositions` が特定座標に集中

**パラメータ調整（不十分）**:

```javascript
// ❌ 単なる乱数範囲の拡大
spawnY = rnd(0, screenHeight);
```

**根本的解決**:

```javascript
// ✅ 空間分割による均等配置システム
class SpatialSpawnManager {
  constructor(gridSize = 4) {
    this.gridSize = gridSize;
    this.cellWidth = screenWidth / gridSize;
    this.cellHeight = screenHeight / gridSize;
    this.recentSpawns = new Map(); // cellId -> lastSpawnTick
    this.cellCooldown = 60; // 同じセルへの連続スポーン防止
  }

  getCell(x, y) {
    const cellX = Math.floor(x / this.cellWidth);
    const cellY = Math.floor(y / this.cellHeight);
    return `${cellX},${cellY}`;
  }

  getAvailableCells() {
    const available = [];
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const cellId = `${x},${y}`;
        const lastSpawn = this.recentSpawns.get(cellId) || -Infinity;

        if (ticks - lastSpawn > this.cellCooldown) {
          available.push({
            id: cellId,
            center: {
              x: (x + 0.5) * this.cellWidth,
              y: (y + 0.5) * this.cellHeight,
            },
            weight: this.calculateWeight(x, y),
          });
        }
      }
    }
    return available;
  }

  calculateWeight(cellX, cellY) {
    // プレイヤーから遠いセルを優先（予測可能性向上）
    const playerCell = this.getCell(player.pos.x, player.pos.y);
    const [px, py] = playerCell.split(",").map(Number);
    const distance = Math.abs(cellX - px) + Math.abs(cellY - py);

    // 距離に応じた重み付け
    return Math.max(1, distance);
  }

  spawn() {
    const available = this.getAvailableCells();
    if (available.length === 0) return null;

    // 重み付きランダム選択
    const totalWeight = available.reduce((sum, c) => sum + c.weight, 0);
    let random = rnd(0, totalWeight);

    for (const cell of available) {
      random -= cell.weight;
      if (random <= 0) {
        // セル内でのランダムオフセット
        const pos = {
          x: cell.center.x + rnds(this.cellWidth * 0.3),
          y: cell.center.y + rnds(this.cellHeight * 0.3),
        };

        this.recentSpawns.set(cell.id, ticks);
        return pos;
      }
    }

    return available[0].center;
  }
}
```

## 4. 改善プロセス

### 4.1 ログの取得

```javascript
const {
  GameSimulator,
  createCrispGameAdapter,
} = require("./scripts/one_button_game_tester");

const simulator = new GameSimulator();
const gameConcept = createCrispGameAdapter("./games/src/my_game.js");

// ロギングを有効化してシミュレーション
const result = simulator.simulateGame(
  gameConcept.init,
  gameConcept.update,
  gameConcept.isGameOver,
  gameConcept.getScore,
  {}, // simulationParams
  3600, // maxTicks (60秒)
  inputPattern, // GA最適化パターンまたはテストパターン
  gameConcept, // crash detection用
  { enabled: true, verboseMode: false } // ロギングオプション
);

// レポートをMarkdown形式で出力
console.log(result.logMarkdown);
```

### 4.2 分析と改善提案の生成

以下のプロンプトテンプレートを使用して LLM に改善を依頼する：

````
## 入力

### ゲームコード
<game_code>
{ゲームのJavaScriptコード}
</game_code>

### シミュレーションログ
<simulation_log>
{result.logMarkdown の内容}
</simulation_log>

## タスク

上記のシミュレーションログを分析し、以下を実行せよ：

1. **問題特定**: ログから読み取れる設計上の問題を3つ以上列挙
2. **根本原因分析**: 各問題の根本原因を特定（パラメータではなくロジック）
3. **改善コード生成**: 各問題に対する具体的なコード修正を提示

### 制約
- パラメータ調整（速度、間隔、サイズの数値変更）のみの提案は不可
- フィールド生成ロジック、ルール、メカニクスの変更を含むこと
- 修正後のコードは150行以内に収まること
- crisp-game-lib の API 仕様に準拠すること

### 出力形式

```markdown
## 問題分析

### 問題1: [問題名]
- **症状**: [ログから読み取れる症状]
- **根本原因**: [なぜこの問題が発生するか]
- **影響**: [ゲーム体験への影響]

## 改善提案

### 改善1: [改善名]
- **対象問題**: 問題1
- **アプローチ**: [どのように解決するか]
- **コード変更**:

\`\`\`javascript
// 変更前
{元のコード}

// 変更後
{改善後のコード}
\`\`\`

## 改善後の期待効果
- [効果1]
- [効果2]
````

````

### 4.3 改善の検証

改善後、再度シミュレーションを実行して効果を確認：

```javascript
// 改善前後の比較
const beforeResult = runSimulation(originalGame);
const afterResult = runSimulation(improvedGame);

console.log('改善前:', {
  score: beforeResult.score,
  survival: beforeResult.duration / 60,
  nearMisses: beforeResult.log?.summary?.nearMisses
});

console.log('改善後:', {
  score: afterResult.score,
  survival: afterResult.duration / 60,
  nearMisses: afterResult.log?.summary?.nearMisses
});
````

## 5. 改善の評価基準

**主要指標は GA 比率**（GA スコア / 単調最高スコア）。

### 主要指標

```
GA比率 = ga.bestScore / monotonous.summary.maxScore
```

| GA 比率    | 評価   | 意味                           |
| :--------- | :----- | :----------------------------- |
| ≤ 1.0      | 不合格 | 単調入力が最適解（スキル不要） |
| 1.0 〜 1.5 | 要検討 | ゲームタイプによる             |
| > 1.5      | 合格   | スキル入力が報われる           |

### 補助指標（詳細ログから取得）

| 指標         | 良好な状態 | 問題のある状態             |
| :----------- | :--------- | :------------------------- |
| ニアミス率   | 10-30%     | 0% または 50%以上          |
| 死因の多様性 | 3 種類以上 | 1 種類が 80%以上           |
| 入力パターン | "varied"   | "spam" または "hold_heavy" |
| 空間利用     | 全域に分散 | 特定領域に集中             |

## 6. アンチパターン

以下の改善は避けること：

### ❌ 数値調整のみ

```javascript
// 問題を隠すだけで解決しない
speed *= 0.8;
interval += 10;
```

### ❌ 条件の追加のみ

```javascript
// 複雑性を増すだけで根本解決しない
if (tooHard) makeEasier();
```

### ❌ ランダム性の増加

```javascript
// 予測不能性を上げても公平性は向上しない
spawnY = rnd(0, 100) + rnd(-10, 10) * difficulty;
```

### ❌ 単純な時間制約やエネルギー制導入による単調入力への対処

## 7. 推奨パターン

### ✅ 構造的ルール変更

```javascript
// プレイヤーの行動に応じて環境が変化
if (playerBehavior === "aggressive") {
  enableCounterMechanic();
}
```

### ✅ 予測可能性の向上

```javascript
// 事前警告システムの導入
spawnWithWarning(position, warningDuration);
```

### ✅ 空間設計の改善

```javascript
// 安全経路を保証する配置アルゴリズム
spawnWithEscapeRoute(obstacles);
```
