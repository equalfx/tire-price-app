# CSVデータ使用ガイド

## 📁 CSVファイルの配置場所

実際のブリヂストンの価格データをCSVファイルとして追加する場合、以下の場所に配置してください：

```
public/data/bridgestone_data.csv
```

## 📋 CSVファイルの形式

### 必須カラム
- `model` - タイヤモデル名
- `width` - タイヤ幅（mm）
- `aspectRatio` - 扁平率（%）
- `diameter` - リム径（インチ）
- `type` - タイヤタイプ（夏タイヤ、冬タイヤ、オールシーズンタイヤ、レーシングタイヤ）
- `price` - 価格（円）

### オプションカラム
- `features` - 特徴（カンマ区切り）
- `wetPerformance` - ウェット性能（1-5の数値）
- `fuelEfficiency` - 燃費（1-5の数値）
- `noiseLevel` - 騒音レベル（1-5の数値）

### サンプルCSV形式

```csv
model,width,aspectRatio,diameter,type,price,features,wetPerformance,fuelEfficiency,noiseLevel
ECOPIA EP150,205,55,16,夏タイヤ,18500,"低燃費,静音性,ウェット性能",4,5,4
TURANZA T005A,215,45,17,夏タイヤ,22800,"高級車対応,スポーツ性能,ウェット性能",5,3,3
BLIZZAK WS90,205,55,16,冬タイヤ,24500,"雪道対応,氷上グリップ,静音性",5,2,4
```

## 🔄 自動読み込み機能

アプリは起動時に自動的に以下を実行します：

1. `public/data/bridgestone_data.csv` の存在をチェック
2. CSVファイルが見つかった場合、それを読み込んで表示
3. CSVファイルが見つからない場合、サンプルデータを使用

## 🛠️ カスタマイズ

### カラム名の変更
CSVファイルで異なるカラム名を使用する場合、`src/utils/csvParser.js` の `loadBridgestoneData` 関数内のマッピングを修正してください：

```javascript
model: row.model || row.モデル || row.name || row.名前 || '',
width: parseInt(row.width || row.幅 || row.width_mm || '') || 0,
// 他のカラムも同様に追加可能
```

### 追加フィールド
CSVファイルに新しいフィールドを追加する場合、`loadBridgestoneData` 関数でマッピングを追加し、必要に応じてコンポーネントも更新してください。

## 📝 注意事項

- CSVファイルはUTF-8エンコーディングで保存してください
- 数値フィールドは文字列でも自動的に数値に変換されます
- 空の行は自動的にスキップされます
- エラーが発生した場合は、サンプルデータが使用されます
