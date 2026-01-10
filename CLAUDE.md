# game-tags プロジェクト

crisp-game-lib を使用したワンボタンゲーム自動生成プロジェクト。タグを発想のシードとして、LLM がゲームを設計・実装・改善する。

---

## ワークフロー概要

- Phase 1: タグ選択 → Phase 2: 設計 → Phase 3: 実装 → Phase 4: テスト → Phase 5: 改善
- Phase 4 から Phase 5 は最大 3 回反復

---

## Phase 1: タグ選択

```bash
node scripts/random_tag_selector.js
```

| オプション     | 説明                 | デフォルト |
| :------------- | :------------------- | :--------- |
| `-n, --count`  | 選択タグ数           | 3          |
| `-s, --seed`   | 乱数シード（再現用） | 現在時刻   |
| `-f, --format` | text/json/markdown   | markdown   |

**重要**: タグは「設計仕様」ではなく「発想のシード」。矛盾するタグは創造的緊張として活用する。

---

## Phase 2: ゲーム設計

**参照**: `one-button-game-design-guide.md` §7

### 設計手順

1. **自由連想**: タグから浮かんだイメージを言語化
2. **逸脱探索**: タグの「逆」「否定」「極端」を考える
3. **コア体験決定**: プレイヤーに与えたい「瞬間の感覚」を一言で
4. **メカニクス構築**: コア体験を実現する 1 ボタン操作を設計
5. **整合性検証**: 下記チェックリストで確認

### 設計チェックリスト

- [ ] 1 ボタンで完結するか
- [ ] ゲームオーバー条件は単一かつ視覚的に明白か
- [ ] 連打・放置で高スコアを獲得できないか
- [ ] スキルのある入力が報われる設計か
- [ ] 「これは見たことがない」と感じる瞬間があるか

### 出力形式

`tmp/games/<slug>/README.md` に以下を記載:

```markdown
# <GAME_NAME> (<slug>)

**タグ**: #tag1, #tag2, #tag3

## 1. コア・メカニクス

<入力 → 挙動 → 終了条件、スコアリングシステム、難度上昇の仕組み>

## 2. オブジェクト仕様

<各オブジェクトの形状・動作・衝突処理>

## 3. デザインガイド分析

<４つのコア設計原則（シンプルさと直感性、視覚的フィードバックとゲームオーバー、スキルベースのスコアリングとリスク・リワード、斬新なメカニクス）への評価>

## 4. タグとの関係

<タグからの発想展開>

## 5. 新規性の根拠

<既存パターンを超えた要素>
```

---

## Phase 3: 実装

**参照**: `crisp-game-lib-guide.md`

### 制約

- **行数**: 150 行程度まで
- **依存**: crisp-game-lib のみ
- **構造**: `title`, `description`, `characters`, `options`, `update()` を含む

### 難易度設定

難易度上昇は `difficulty` 変数（自動増加）を活用:

```javascript
let count = 3 * sqrt(difficulty); // 徐々に増加
let speed = 1.0 + difficulty; // 徐々に加速
```

### 出力先

`tmp/games/<slug>/` に以下を配置:

- `index.html` - HTML テンプレート
- `main.js` - ゲームコード

### HTML テンプレート

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>GAME_NAME</title>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1"
    />
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/core/dist/algo-chip.umd.js"></script>
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/util/dist/algo-chip-util.umd.js"></script>
    <script src="https://unpkg.com/crisp-game-lib@latest/docs/bundle.js"></script>
    <script src="./main.js"></script>
    <script>
      window.addEventListener("load", onLoad);
    </script>
  </head>
  <body style="background: #ddd"></body>
</html>
```

### 実装テンプレート

```javascript
title = "GAME_NAME";

description = `
[Hold] Action
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let obstacles;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80) };
    obstacles = [];
  }

  // 入力処理
  if (input.isJustPressed) {
    // ボタン押下時
  }
  if (input.isPressed) {
    // ボタン押し続け時
  }

  // ★重要: 衝突判定の描画順序
  // 検出対象を「先に」描画する（後から描画したものは検出できない）

  // 1. プレイヤーを先に描画
  color("cyan");
  box(player.pos, 6);

  // 2. 障害物を後に描画し、プレイヤー(cyan)との衝突を検出
  color("red");
  obstacles.forEach((obs) => {
    if (box(obs.pos, 8).isColliding.rect.cyan) {
      end(); // プレイヤーに衝突
    }
  });
}
```

### 実装上の注意

#### 衝突判定の描画順序（重要）

crisp-game-lib では**先に描画したオブジェクトとしか衝突判定できない**。

```javascript
// ❌ 動かない: obstacles描画時にplayer(cyan)がまだない
obstacles.forEach(o => box(o.pos, 8));  // red
box(player.pos, 6);                      // cyan（後）

// ✅ 正しい: 検出対象を先に描画
box(player.pos, 6);                      // cyan（先）
obstacles.forEach(o => {
  if (box(o.pos, 8).isColliding.rect.cyan) { ... }  // red
});
```

#### テスター互換性（重要）

テスター（`one_button_game_tester.js`, `ga_tester.js`）は `update()` 関数のみを抽出して実行する。
**`update()` 外で定義したヘルパー関数は認識されない。**

```javascript
// ❌ テスターで動かない
function spawnEnemies() { ... }  // update外の関数
function update() {
  spawnEnemies();  // ReferenceError: spawnEnemies is not defined
}

// ✅ テスター互換: ロジックをupdate内にインライン化
function update() {
  if (!ticks) {
    // 初期化ロジックをここに直接記述
  }
  // スポーンロジックもここに直接記述
}
```

---

## Phase 4: シミュレーション（GA 相対評価）

評価は **GA スコア / 単調スコア** の比率のみで行う。

```bash
node scripts/ga_tester.js tmp/games/<slug>/main.js
```

### 出力形式

```json
{
  "gameName": "example",
  "monotonous": {
    "patterns": {
      "NoInput": { "survivalTime": 2.3, "score": 0 },
      "HoldOnly": { "survivalTime": 1.8, "score": 5 },
      "SpamPress": { "survivalTime": 3.1, "score": 12 }
    },
    "summary": {
      "avgScore": 5.67,
      "maxScore": 12,
      "avgSurvivalTime": 2.4,
      "maxSurvivalTime": 3.1
    }
  },
  "ga": {
    "bestScore": 87,
    "bestSurvivalTime": 15.2,
    "bestGenomeLength": 42,
    "generationsRun": 30,
    "populationSize": 50
  },
  "error": null
}
```

### 評価指標（LLM が計算・判断）

```
GA比率 = ga.bestScore / monotonous.summary.maxScore
```

| GA 比率    | 評価   | 意味                           |
| :--------- | :----- | :----------------------------- |
| ≤ 1.0      | 不合格 | 単調入力が最適解（スキル不要） |
| 1.0 〜 1.5 | 要検討 | スキルの反映が不十分           |
| > 1.5      | 合格   | スキル入力が報われる           |

### Phase 5 へ進む条件

- GA 比率 ≤ 1.5 程度

---

## Phase 5: 改善

**参照**: `game-improvement-guide.md`

### 5a: 詳細ログ取得

```bash
node scripts/ga_tester.js tmp/games/<slug>/main.js --verbose
```

`--verbose` オプションで **GA 最適化パターンの詳細ログ** を取得する。

**重要**: 分析対象は `ga.detailedLog` のみ。単調入力（NoInput、HoldOnly、SpamPress）のログは「不適切なプレイ」を表すため、改善分析には使用しない。

#### 詳細ログの構造

```json
{
  "gameName": "example",
  "monotonous": {
    "patterns": { ... },
    "summary": { ... }
  },
  "ga": {
    "bestScore": 87,
    "bestSurvivalTime": 15.2,
    "bestGenomeLength": 42,
    "generationsRun": 30,
    "populationSize": 50,
    "detailedLog": {
      "summary": { "survivalTime": "15.20s", "totalScore": 87, ... },
      "deathAnalysis": {
        "cause": "game_logic",
        "position": { "x": 50, "y": 30 },
        "approachAnalysis": { "playerVelocity": { "x": "0.00", "y": "-1.50" } },
        "recentFrames": [ ... ]
      },
      "scoringAnalysis": {
        "totalEvents": 25,
        "triggers": { "enemy_destroy": 15, "item_collect": 10 },
        "scoringRate": { "0": 10, "1": 15, "2": 20 }
      },
      "spawnAnalysis": {
        "totalSpawns": 45,
        "averageInterval": "45.2",
        "minInterval": 20,
        "maxInterval": 80,
        "spatialDistribution": { "xRange": [10, 90], "yRange": [0, 100] }
      },
      "inputAnalysis": {
        "pattern": "varied",
        "totalPresses": 85,
        "maxHoldDuration": 30
      }
    }
  }
}
```

### 5b: ログ分析と改善

`game-improvement-guide.md` に従い、詳細ログから問題を特定し改善する。

#### 分析観点（`ga.detailedLog` を参照）

| 分析項目             | 確認内容                                                          | 問題の兆候                 |
| :------------------- | :---------------------------------------------------------------- | :------------------------- |
| **死因分析**         | `ga.detailedLog.deathAnalysis.position`, `recentFrames`           | 同一位置での死亡集中       |
| **スポーン分析**     | `ga.detailedLog.spawnAnalysis.minInterval`, `spatialDistribution` | 間隔・空間分布の偏り       |
| **スコアリング分析** | `ga.detailedLog.scoringAnalysis.triggers`, `scoringRate`          | 獲得手段の多様性欠如       |
| **入力分析**         | `ga.detailedLog.inputAnalysis.pattern`                            | `spam` または `hold_heavy` |

### 推奨アプローチ

| 優先度 | アプローチ           | 例                             |
| :----- | :------------------- | :----------------------------- |
| 高     | 配置ロジック改善     | 安全経路を保証するスポーン     |
| 高     | 予告システム導入     | 障害物出現前の視覚的警告       |
| 中     | フェーズベース難易度 | 時間経過で新メカニクス導入     |
| 中     | 入力パターン対応     | 連打ペナルティ、リズムボーナス |

### 禁止事項

```javascript
// ❌ 数値調整のみ
speed *= 0.8;

// ❌ 条件の追加のみ
if (tooHard) makeEasier();

// ❌ ランダム性の増加
spawnY = rnd(0, 100) + rnd(-10, 10);
```

改善後は Phase 4 に戻る（最大 3 回）。

---

## 成果物

```
tmp/games/<slug>/
├── index.html    # HTMLテンプレート
├── main.js       # ゲームコード
└── README.md     # ゲーム説明
```

### 最終レポート形式

```markdown
# ゲーム生成レポート: <GAME_NAME>

## 選択タグ

- tag1, tag2, tag3

## シミュレーション結果

| 指標       | 初回 | 改善後 |
| :--------- | :--- | :----- |
| 評価       | X/6  | Y/6    |
| GA vs 単調 | X.Xx | Y.Yx   |

## 実施した改善

1. <改善内容と理由>
```

---

## プロジェクト構成

```
game-tags/
├── tmp/games/                      # 生成ゲーム
│   └── <slug>/
│       ├── index.html              # HTMLテンプレート
│       ├── main.js                 # ゲームコード
│       └── README.md               # ゲーム説明
├── scripts/
│   ├── random_tag_selector.js      # タグ選択
│   ├── one_button_game_tester.js   # 4a: 高速テスト（単調入力）
│   ├── ga_tester.js                # 4b: 詳細テスト（GA有効）
│   ├── crisp_game_adapter.js       # ライブラリアダプター
│   └── dynamic_game_injector.js    # パラメータ注入
├── tags.csv                        # 全タグ（107個）
├── one-button-game-design-guide.md # 設計ガイド
├── game-improvement-guide.md       # 改善ガイド
└── crisp-game-lib-guide.md         # API リファレンス
```

---

## タグカテゴリ

| カテゴリ      | 説明             | 例                                      |
| :------------ | :--------------- | :-------------------------------------- |
| `player`      | プレイヤー特性   | `player-rotate`, `player-multiple`      |
| `on_pressed`  | ボタン押下時     | `on_pressed-jump`, `on_pressed-turn`    |
| `on_holding`  | ボタン押し続け時 | `on_holding-move`, `on_holding-charge`  |
| `on_released` | ボタン離し時     | `on_released-throw`                     |
| `on_got_item` | アイテム取得時   | `on_got_item-power_up`                  |
| `field`       | フィールド特性   | `field-auto_scroll`, `field-1D`         |
| `rule`        | ゲームルール     | `rule-physics`, `rule-combo_multiplier` |
| `weapon`      | 武器・攻撃       | `weapon-explosion`, `weapon-reflect`    |
| `obstacle`    | 障害物           | `obstacle-chase`, `obstacle-penalty`    |
