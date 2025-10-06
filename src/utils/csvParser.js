// CSVパーサー関数（簡略版）
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 簡単な分割（カンマ区切り、ダブルクォート対応）
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // オブジェクトに変換
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  console.log('CSV解析結果:', data.length, '行');
  return data;
};

// CSVファイルを読み込む関数
export const loadCSVData = async (csvPath) => {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('CSV読み込みエラー:', error);
    throw error;
  }
};

// ブリヂストンデータを読み込む関数
export const loadBridgestoneData = async () => {
  try {
    console.log('CSVデータ読み込み開始...');
    const csvData = await loadCSVData('/data/bridgestone_data.csv');
    console.log('CSVデータ取得成功:', csvData.length, '行');
    
    if (csvData.length === 0) {
      console.log('CSVデータが空です');
      return [];
    }
    
    // 横型CSVデータを縦型に変換
    const tireData = [];
    
    // ヘッダー行（1行目）からモデル名を取得
    const headers = Object.keys(csvData[0]);
    console.log('CSVヘッダー:', headers);
    
    const sizeColumn = headers[0]; // 最初のカラムはサイズ
    const modelColumns = headers.slice(1); // 残りはモデル名
    
    console.log('サイズカラム:', sizeColumn);
    console.log('モデルカラム:', modelColumns);
    
    csvData.forEach((row, rowIndex) => {
      const sizeText = row[sizeColumn];
      if (!sizeText) {
        console.log(`行 ${rowIndex + 1}: サイズテキストが空`);
        return;
      }
      
      console.log(`行 ${rowIndex + 1}: サイズテキスト =`, sizeText);
      
      // 半角数字なので直接解析
      console.log('サイズテキスト:', sizeText);
      
      // サイズを解析（例: "225/40R18" → width: 225, aspectRatio: 40, diameter: 18）
      const sizeMatch = sizeText.match(/(\d+)\/(\d+)R(\d+)/);
      if (!sizeMatch) {
        console.log('サイズマッチングエラー:', sizeText);
        return;
      }
      
      const width = parseInt(sizeMatch[1]);
      const aspectRatio = parseInt(sizeMatch[2]);
      const diameter = parseInt(sizeMatch[3]);
      
      console.log('サイズ解析:', sizeText, '→', { width, aspectRatio, diameter });
      
      // 各モデルの価格を処理
      modelColumns.forEach(modelName => {
        const priceText = row[modelName];
        if (!priceText || priceText.trim() === '') {
          console.log(`モデル ${modelName}: 価格が空`);
          return;
        }
        
        console.log(`モデル ${modelName}: 価格テキスト =`, priceText);
        
        // 価格から数値を抽出（例: "¥75,790" → 75790）
        const priceMatch = priceText.match(/¥?([\d,]+)/);
        if (!priceMatch) {
          console.log('価格マッチングエラー:', priceText);
          return;
        }
        
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        console.log('価格抽出:', priceText, '→', price);
        
        tireData.push({
          brand: 'ブリヂストン',
          model: modelName,
          width: width,
          aspectRatio: aspectRatio,
          diameter: diameter,
          type: '冬タイヤ',
          price: price,
          features: ['冬タイヤ', '雪道対応', '氷上グリップ'],
          wetPerformance: 5,
          fuelEfficiency: 2,
          noiseLevel: 3,
          sizeText: sizeText, // 元のサイズ表記を保持
          originalPriceText: priceText // 元の価格表記を保持
        });
      });
    });
    
    const filteredData = tireData.filter(tire => tire.model && tire.width > 0 && tire.price > 0);
    console.log('作成されたタイヤデータ数:', filteredData.length);
    console.log('最初の3件:', filteredData.slice(0, 3));
    return filteredData;
    
  } catch (error) {
    console.error('ブリヂストンデータ読み込みエラー:', error);
    // エラーの場合は空の配列を返す
    return [];
  }
};
