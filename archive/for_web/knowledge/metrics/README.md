# メトリクス記録ディレクトリ

## ファイル一覧

### `tag_combo_history.csv`

プロトタイプゲームの評価メトリクスを記録するCSVファイル。

**カラム定義:**

- `date`: 評価実行日（YYYY-MM-DD形式）
- `tags`: タグリスト（パイプ区切り、例: "player:bounce|field:gravity"）
- `slug`: ゲームスラッグ名
- `outcome`: 評価結果（pass/fail）
- `notes`: 追加メモ（mode=lint など）
- `ga_best_score`: GA最良スコア（GA評価時のみ）
- `ga_resistance`: GA耐性評価（Low/Moderate/High、GA評価時のみ）

**使用例:**

```csv
date,tags,slug,outcome,notes,ga_best_score,ga_resistance
2025-10-05,"player:rotate|field:outpost",rotor_outpost,pass,mode=ga,45,Low
2025-10-05,"player:bounce|weapon:artillery",bounce_artillery,pass,mode=sim,,
```

## 更新タイミング

- `verify_prototype.js` 実行時に自動的にメトリクス行が追加される
- GA モード (`--mode ga`) 実行時は GA 関連列も記録される

## 分析方法

このCSVファイルを使って以下の分析が可能：

1. **タグ組み合わせの効果**: どのタグ組み合わせが高品質ゲームを生成するか
2. **GA耐性トレンド**: GA耐性の高いゲームの特徴
3. **時系列変化**: プロンプト改善による品質向上の追跡
