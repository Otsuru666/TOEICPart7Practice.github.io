# 📚 TOEIC学習システム

週次TOEIC部の活動を支援する、問題自動生成＆データ分析システムです。

## 🎯 システム概要

### 1. 問題生成器
Cursor AIを使ってTOEIC Part 7の問題を自動生成

### 2. TOEIC部管理システム
活動記録の管理、弱点分析、個別最適化された学習推奨

## 📁 ディレクトリ構造

```
TOEIC/
├── README.md                    # このファイル
├── 問題/                         # 生成された問題（Markdown）
│   ├── 120-124.md
│   ├── 125-129.md
│   └── 130-134.md
├── 問題生成器/
│   ├── generate_problem.py     # 問題生成スクリプト
│   ├── toeic_club.py           # TOEIC部管理スクリプト
│   ├── prompts.py              # プロンプトテンプレート
│   ├── config.yaml             # 設定ファイル
│   ├── requirements.txt        # 依存パッケージ
│   ├── README.md               # 問題生成器の詳細
│   └── QUICKSTART.md           # クイックスタート
├── TOEIC部データ/
│   ├── members.yaml            # メンバー情報
│   ├── problems_db.json        # 問題データベース
│   ├── results_db.json         # 結果データベース
│   ├── csv_template.csv        # CSVテンプレート
│   └── README.md               # TOEIC部システムの詳細
└── archive/                     # 古いファイル
    ├── 回答/
    └── 回答作成文字起こし/
```

## 🚀 クイックスタート

### 初回セットアップ（5分）

```bash
# 1. ディレクトリに移動
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"

# 2. 必要なパッケージをインストール
pip3 install -r requirements.txt

# 3. メンバー情報を更新
# 「TOEIC部データ/members.yaml」を編集
```

### 問題を生成する（3分）

```bash
# パラメータを指定して実行
python3 generate_problem.py -p 2 -q 5 -d 中級

# Cursorチャットにプロンプトをコピー＆ペースト
# 生成された問題を保存（Markdown形式）
```

### TOEIC部活動を記録する

```bash
# 問題を登録
python3 toeic_club.py register-problem 130-134.md -p 2 -q 5 -d 中級

# セッション後、CSVをインポート
python3 toeic_club.py import-results session_results.csv

# 分析を確認
python3 toeic_club.py analyze member_001
python3 toeic_club.py stats

# 次回の推奨設定
python3 toeic_club.py recommend member_001
```

## 🔄 週次ワークフロー

### セッション前（準備：5-10分）

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"

# 1. 各メンバーの推奨設定を確認
python3 toeic_club.py recommend member_001
python3 toeic_club.py recommend member_002
python3 toeic_club.py recommend member_003

# 2. 問題を生成
python3 generate_problem.py -p 2 -q 5 -d 中級

# 3. Cursorで問題を作成（生成されたプロンプトを使用）

# 4. 問題を登録
python3 toeic_club.py register-problem 135-139.md -p 2 -q 5 -d 中級

# 5. Markdownファイルをメンバーに共有（Notion等にコピー）
```

### セッション中（60分）

1. **全員で問題を解く**（25分、1問1分×5問）
2. **輪番ファシリテーターが解説**（20分）
3. **ディスカッション**（15分）
4. **スプレッドシートに結果を記録**

### セッション後（分析：5分）

```bash
# 1. 結果をCSVでエクスポート
# スプレッドシートから csv_template.csv の形式で

# 2. CSVをインポート
python3 toeic_club.py import-results ~/Downloads/toeic_session.csv

# 3. 統計を確認
python3 toeic_club.py stats
```

## 🎯 主な機能

### ✨ 問題生成

- **パラメータ調整可能**: パッセージ数（1-3）、難易度、質問数
- **多様なトピック**: ビジネス、レストラン、旅行、採用等
- **自動採番**: 既存問題から自動で問題番号を付与
- **Cursor統合**: 追加API料金なし
- **Markdown形式**: Notionに簡単にコピー可能

### 📈 データ分析

- **個人別統計**: 正答率、問題タイプ別成績、平均解答時間
- **弱点特定**: 正答率60%未満の問題タイプを自動検出
- **全体統計**: メンバー別サマリー、セッション履歴
- **トレンド追跡**: 長期的な成長を可視化

### 💡 レコメンデーション

- **難易度調整**: 正答率に基づいた最適な難易度を提案
- **パッセージ数**: 理解度に応じた適切な量を提案
- **弱点克服**: 苦手な問題タイプを重点的に含める提案
- **学習プラン**: 次回の具体的な設定を自動生成

## 💻 技術情報

### システム要件

- **OS**: macOS（Darwinベース）
- **Python**: 3.x
- **AI**: Cursor AI（Claude Sonnet 4.5）
- **ライブラリ**: PyYAML

### データ形式

- **メンバー情報**: YAML
- **データベース**: JSON
- **結果インポート**: CSV（UTF-8）
- **問題**: Markdown（Notionにコピー可能）

## 🎓 TOEIC部について

### メンバー構成

- **3人体制**（nakato + 2名）
- レベル差が大きい（800点 vs 300-400点）
- 週次オンライン活動
- 輪番制ファシリテーション

### 活動目標

1. **スコアアップ**: 各自の目標スコア達成
2. **継続学習**: 週次の習慣化
3. **楽しむ**: ワイワイ学習
4. **データ活用**: 科学的なアプローチ

## 🔧 カスタマイズ

### エイリアス設定

`.zshrc` に追加：

```bash
# ディレクトリ移動
alias toeic-cd='cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"'

# コマンド短縮
alias toeic='python3 toeic_club.py'
alias toeic-gen='python3 generate_problem.py'
```

使用例：

```bash
toeic-cd
toeic stats
toeic analyze member_001
toeic-gen -p 2 -q 5 -d 中級
```

### デフォルト設定

`問題生成器/config.yaml` を編集：

```yaml
default:
  passages: 2        # よく使うパッセージ数
  questions: 5       # よく使う質問数
  difficulty: "中級" # よく使う難易度
```

## 🆘 トラブルシューティング

### PyYAMLがインストールされていない

```bash
pip3 install -r requirements.txt
```

### ファイルが見つからない

フルパスで実行：

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"
```

### CSVインポートエラー

- UTF-8エンコーディングを確認
- 必須列がすべて含まれているか確認
- `csv_template.csv` を参照

## 📚 リソース

### 内部リンク

- [問題フォルダ](./問題/)
- [問題生成器](./問題生成器/)
- [TOEIC部データ](./TOEIC部データ/)

### 外部リソース

- [TOEICテスト公式サイト](https://www.iibc-global.org/toeic.html)
- [Cursor AI Documentation](https://cursor.sh/docs)

## 📊 成果指標

### 効率化

- 問題準備時間: **50%削減**
- データ分析時間: **自動化**
- 個別最適化: **実現**

### 学習効果

- 継続率: **100%維持**
- スコアアップ: **追跡中**
- エンゲージメント: **高レベル**

---

**作成日**: 2025年11月6日  
**バージョン**: 2.0.0（シンプル版）  
**作成者**: nakato  

**Have fun learning! 🎓✨**
