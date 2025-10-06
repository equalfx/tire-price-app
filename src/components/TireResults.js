import React, { useState } from 'react';
import './TireResults.css';

const TireResults = ({ results }) => {
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedResults = [...results].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'brand':
        aValue = a.brand;
        bValue = b.brand;
        break;
      case 'size':
        aValue = `${a.width}/${a.aspectRatio}R${a.diameter}`;
        bValue = `${b.width}/${b.aspectRatio}R${b.diameter}`;
        break;
      default:
        aValue = a.price;
        bValue = b.price;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatPrice = (tire) => {
    // 実際の価格表記があればそれを使用、なければフォーマット済み価格を使用
    if (tire.originalPriceText) {
      return tire.originalPriceText;
    }
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(tire.price);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case '夏タイヤ':
        return '☀️';
      case '冬タイヤ':
        return '❄️';
      case 'オールシーズンタイヤ':
        return '🌍';
      case 'レーシングタイヤ':
        return '🏁';
      default:
        return '🛞';
    }
  };

  const getPerformanceStars = (performance) => {
    return '⭐'.repeat(performance);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>📋 検索結果 ({results.length}件)</h2>
        
        <div className="sort-controls">
          <label htmlFor="sortBy">並び替え:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">価格</option>
            <option value="brand">ブランド</option>
            <option value="size">サイズ</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="tire-grid">
        {sortedResults.map((tire, index) => (
          <div key={index} className="tire-card">
            <div className="tire-card-header">
              <div className="tire-brand">{tire.brand}</div>
              <div className="tire-type">
                {getTypeIcon(tire.type)} {tire.type}
              </div>
            </div>
            
            <div className="tire-model">{tire.model}</div>
            
            <div className="tire-size">
              <span className="size-label">サイズ:</span>
              <span className="size-value">
                {tire.sizeText || `${tire.width}/${tire.aspectRatio}R${tire.diameter}`}
              </span>
            </div>
            
            <div className="tire-features">
              {tire.features.map((feature, idx) => (
                <span key={idx} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="tire-performance">
              <div className="performance-item">
                <span>ウェット性能:</span>
                <span>{getPerformanceStars(tire.wetPerformance)}</span>
              </div>
              <div className="performance-item">
                <span>燃費:</span>
                <span>{getPerformanceStars(tire.fuelEfficiency)}</span>
              </div>
              <div className="performance-item">
                <span>騒音:</span>
                <span>{getPerformanceStars(tire.noiseLevel)}</span>
              </div>
            </div>
            
            <div className="tire-price">
              <span className="price-label">価格:</span>
              <span className="price-value">{formatPrice(tire)}</span>
            </div>
            
            <div className="tire-actions">
              <button className="detail-btn">詳細を見る</button>
              <button className="compare-btn">比較に追加</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TireResults;
