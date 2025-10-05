import React, { useState } from 'react';
import './App.css';
import TireSearchForm from './components/TireSearchForm';
import TireResults from './components/TireResults';
import { sampleTireData } from './data/sampleData';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchParams) => {
    setIsSearching(true);
    
    // シミュレートされた検索遅延
    setTimeout(() => {
      const filteredResults = filterTires(sampleTireData, searchParams);
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const filterTires = (tires, params) => {
    return tires.filter(tire => {
      // サイズフィルタ
      if (params.width && tire.width !== parseInt(params.width)) return false;
      if (params.aspectRatio && tire.aspectRatio !== parseInt(params.aspectRatio)) return false;
      if (params.diameter && tire.diameter !== parseInt(params.diameter)) return false;
      
      // ブランドフィルタ
      if (params.brand && tire.brand !== params.brand) return false;
      
      // タイプフィルタ
      if (params.type && tire.type !== params.type) return false;
      
      // 価格フィルタ
      if (params.minPrice && tire.price < parseInt(params.minPrice)) return false;
      if (params.maxPrice && tire.price > parseInt(params.maxPrice)) return false;
      
      return true;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚗 タイヤ価格検索アプリ</h1>
        <p>最適なタイヤを探してみましょう</p>
      </header>
      
      <main className="App-main">
        <TireSearchForm onSearch={handleSearch} />
        
        {isSearching && (
          <div className="loading">
            <p>検索中...</p>
          </div>
        )}
        
        {searchResults.length > 0 && !isSearching && (
          <TireResults results={searchResults} />
        )}
        
        {searchResults.length === 0 && !isSearching && (
          <div className="no-results">
            <p>検索条件に一致するタイヤが見つかりませんでした。</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
