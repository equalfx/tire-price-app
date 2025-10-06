// CSVパーサー関数
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    // オブジェクトに変換
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
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
    const csvData = await loadCSVData('/data/bridgestone_data.csv');
    
    // 横型CSVデータを縦型に変換
    const tireData = [];
    
    // ヘッダー行（1行目）からモデル名を取得
    const headers = Object.keys(csvData[0]);
    const sizeColumn = headers[0]; // 最初のカラムはサイズ
    const modelColumns = headers.slice(1); // 残りはモデル名
    
    csvData.forEach(row => {
      const sizeText = row[sizeColumn];
      if (!sizeText) return;
      
      // 全角数字を半角に変換
      const normalizedSizeText = sizeText
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
      
      // サイズを解析（例: "225/40R18" → width: 225, aspectRatio: 40, diameter: 18）
      const sizeMatch = normalizedSizeText.match(/(\d+)\/(\d+)R(\d+)/);
      if (!sizeMatch) return;
      
      const width = parseInt(sizeMatch[1]);
      const aspectRatio = parseInt(sizeMatch[2]);
      const diameter = parseInt(sizeMatch[3]);
      
      // 各モデルの価格を処理
      modelColumns.forEach(modelName => {
        const priceText = row[modelName];
        if (!priceText || priceText.trim() === '') return;
        
        // 価格から数値を抽出（例: "¥75,790" → 75790）
        const priceMatch = priceText.match(/¥?([\d,]+)/);
        if (!priceMatch) return;
        
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        
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
    
    return tireData.filter(tire => tire.model && tire.width > 0 && tire.price > 0);
    
  } catch (error) {
    console.error('ブリヂストンデータ読み込みエラー:', error);
    // エラーの場合は空の配列を返す
    return [];
  }
};
