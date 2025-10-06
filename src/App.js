import React, { useState, useEffect } from 'react';
import './App.css';
import TireSearchForm from './components/TireSearchForm';
import TireResults from './components/TireResults';
import { sampleTireData } from './data/sampleData';
import { loadBridgestoneData } from './utils/csvParser';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allTireData, setAllTireData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataSource, setDataSource] = useState('sample'); // 'sample' or 'csv'
  const [searchParams, setSearchParams] = useState(null);

  // コンポーネントマウント時にデータを読み込み
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        // まずCSVデータを試す
        const csvData = await loadBridgestoneData();
        if (csvData.length > 0) {
          setAllTireData(csvData);
          setDataSource('csv');
          console.log(`CSVデータを読み込みました: ${csvData.length}件`);
        } else {
          // CSVデータがない場合はサンプルデータを使用
          setAllTireData(sampleTireData);
          setDataSource('sample');
          console.log('サンプルデータを使用します');
        }
      } catch (error) {
        console.error('データ読み込みエラー:', error);
        // エラーの場合はサンプルデータを使用
        setAllTireData(sampleTireData);
        setDataSource('sample');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (params) => {
    setIsSearching(true);
    setSearchParams(params);
    
    // 短い検索遅延（リアルタイム検索用）
    setTimeout(() => {
      const filteredResults = filterTires(allTireData, params);
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 100);
  };

  const filterTires = (tires, params) => {
    console.log('検索パラメータ:', params);
    console.log('検索対象タイヤ数:', tires.length);
    
    const filtered = tires.filter(tire => {
      // サイズフィルタ
      if (params.width && tire.width !== parseInt(params.width)) return false;
      if (params.aspectRatio && tire.aspectRatio !== parseInt(params.aspectRatio)) return false;
      if (params.diameter && tire.diameter !== parseInt(params.diameter)) return false;
      
      // ブランドフィルタ
      if (params.brand && tire.brand !== params.brand) return false;
      
      // モデルフィルタ
      if (params.model && tire.model !== params.model) return false;
      
      // タイプフィルタ
      if (params.type && tire.type !== params.type) return false;
      
      return true;
    });
    
    console.log('検索結果数:', filtered.length);
    return filtered;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚗 タイヤ価格検索アプリ</h1>
        <p>最適なタイヤを探してみましょう</p>
        {!isLoadingData && (
          <div className="data-source-info">
            {dataSource === 'csv' ? (
              <span>📊 実際のブリヂストンデータ ({allTireData.length}件)</span>
            ) : (
              <span>📝 サンプルデータ ({allTireData.length}件)</span>
            )}
          </div>
        )}
      </header>
      
      <main className="App-main">
        {isLoadingData ? (
          <div className="loading">
            <p>データを読み込み中...</p>
          </div>
        ) : (
          <div>
            <TireSearchForm onSearch={handleSearch} />
            
            {isSearching && (
              <div className="loading">
                <p>検索中...</p>
              </div>
            )}
            
            {searchResults.length > 0 && !isSearching && (
              <TireResults results={searchResults} searchParams={searchParams} />
            )}
            
            {searchResults.length === 0 && !isSearching && (
              <div className="no-results">
                <p>検索条件に一致するタイヤが見つかりませんでした。</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
