import React, { useState } from 'react';
import './TireResults.css';

const TireResults = ({ results, searchParams = {} }) => {
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

  // 車種別工賃
  const getLaborCost = () => {
    const carTypes = {
      '軽・コンパクト': 6600,
      'ミディアム': 7150,
      'ラージ以上': 9900
    };
    return carTypes[searchParams.carType] || 6600;
  };

  // 料金計算
  const calculateTotalPrice = (tire) => {
    const tirePrice = tire.price;
    const laborCost = getLaborCost();
    const airValveCost = (searchParams.airValve || 4) * 429; // エアバルブ1本¥429
    const tireDisposalCost = (searchParams.tireDisposal || 4) * 550; // 廃タイヤ1本¥550
    const maintenancePackDiscount = searchParams.maintenancePack ? 1100 : 0; // メンテナンスパック割引
    
    const subtotal = tirePrice + laborCost + airValveCost + tireDisposalCost - maintenancePackDiscount;
    const tax = Math.floor(subtotal * 0.1); // 消費税10%
    return subtotal + tax;
  };

  const formatTotalPrice = (tire) => {
    const totalPrice = calculateTotalPrice(tire);
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(totalPrice);
  };

  // 価格内訳の計算
  const calculatePriceBreakdown = (tire) => {
    const tirePrice = tire.price;
    const laborCost = getLaborCost();
    const airValveCost = (searchParams.airValve || 4) * 429;
    const tireDisposalCost = (searchParams.tireDisposal || 4) * 550;
    const maintenancePackDiscount = searchParams.maintenancePack ? 1100 : 0;
    
    return {
      tirePrice,
      laborCost,
      airValveCost,
      tireDisposalCost,
      maintenancePackDiscount,
      subtotal: tirePrice + laborCost + airValveCost + tireDisposalCost - maintenancePackDiscount,
      tax: Math.floor((tirePrice + laborCost + airValveCost + tireDisposalCost - maintenancePackDiscount) * 0.1),
      total: calculateTotalPrice(tire)
    };
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
            
            <div className="tire-price-breakdown">
              {(() => {
                const breakdown = calculatePriceBreakdown(tire);
                return (
                  <>
                    <div className="price-item">
                      <span>タイヤ価格:</span>
                      <span>{formatPrice(tire)}</span>
                    </div>
                    <div className="price-item">
                      <span>工賃 ({searchParams.carType || '軽・コンパクト'}):</span>
                      <span>¥{breakdown.laborCost.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span>エアバルブ ({searchParams.airValve || 4}本):</span>
                      <span>¥{breakdown.airValveCost.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span>廃タイヤ ({searchParams.tireDisposal || 4}本):</span>
                      <span>¥{breakdown.tireDisposalCost.toLocaleString()}</span>
                    </div>
                    {breakdown.maintenancePackDiscount > 0 && (
                      <div className="price-item discount">
                        <span>メンテナンスパック割引:</span>
                        <span>-¥{breakdown.maintenancePackDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="price-item subtotal">
                      <span>小計:</span>
                      <span>¥{breakdown.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span>消費税 (10%):</span>
                      <span>¥{breakdown.tax.toLocaleString()}</span>
                    </div>
                    <div className="price-item total">
                      <span>税込合計:</span>
                      <span className="total-price">{formatTotalPrice(tire)}</span>
                    </div>
                  </>
                );
              })()}
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
