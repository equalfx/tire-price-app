import React, { useState } from 'react';
import './TireSearchForm.css';

const TireSearchForm = ({ onSearch }) => {
        const [formData, setFormData] = useState({
          width: '',
          aspectRatio: '',
          diameter: '',
          brand: '',
          model: '',
          type: '',
          carType: '軽・コンパクト', // 車種選択
          maintenancePack: false, // メンテナンスパック加入
          airValve: 4, // エアバルブ本数（デフォルト4本）
          tireDisposal: 4, // 廃タイヤ本数（デフォルト4本）
          tireQuantity: 4 // タイヤ本数（デフォルト4本）
        });

  // ブリヂストンのみ対応
  const brands = [
    '', 'ブリヂストン'
  ];

  // ブリヂストンの冬タイヤモデル
  const bridgestoneModels = [
    '', 'WZ-1', 'VRX3', 'DM-V3', 'VL-10', 'W300', 'DM-V1'
  ];

  const tireTypes = [
    '', '冬タイヤ'
  ];

  // 車種別工賃
  const carTypes = [
    { value: '軽・コンパクト', label: '軽・コンパクト', laborCost: 6600 },
    { value: 'ミディアム', label: 'ミディアム', laborCost: 7150 },
    { value: 'ラージ以上', label: 'ラージ以上', laborCost: 9900 }
  ];

  // 料金設定
  const MAINTENANCE_PACK_DISCOUNT = 1100; // メンテナンスパック割引
  const AIR_VALVE_COST = 429; // エアバルブ1本
  const TIRE_DISPOSAL_COST = 550; // 廃タイヤ1本

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      // ブランドが変更されたらモデルをリセット
      ...(name === 'brand' ? { model: '' } : {})
    };
    
    setFormData(newFormData);
    
    // サイズと種類が選択されたら自動検索
    if (name === 'width' || name === 'aspectRatio' || name === 'diameter' || 
        name === 'brand' || name === 'model' || name === 'type' || name === 'carType' ||
        name === 'maintenancePack' || name === 'airValve' || name === 'tireDisposal' || name === 'tireQuantity') {
      const hasSize = newFormData.width || newFormData.aspectRatio || newFormData.diameter;
      const hasType = newFormData.type;
      
      if (hasSize || hasType || newFormData.brand || newFormData.model) { // ブランドやモデル選択でも検索をトリガー
        onSearch(newFormData);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleClear = () => {
    const clearedData = {
      width: '',
      aspectRatio: '',
      diameter: '',
      brand: '',
      model: '',
      type: '',
      carType: '軽・コンパクト',
      maintenancePack: false,
      airValve: 4,
      tireDisposal: 4,
      tireQuantity: 4
    };
    setFormData(clearedData);
    onSearch(clearedData);
  };

  return (
    <div className="search-form-container">
      <h2>🔍 タイヤ検索</h2>
      <p>サイズや種類を選択すると自動的に価格が表示されます</p>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="width">タイヤ幅 (mm)</label>
            <input
              type="number"
              id="width"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              placeholder="例: 205"
              min="155"
              max="355"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="aspectRatio">扁平率 (%)</label>
            <input
              type="number"
              id="aspectRatio"
              name="aspectRatio"
              value={formData.aspectRatio}
              onChange={handleInputChange}
              placeholder="例: 55"
              min="25"
              max="85"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="diameter">リム径 (インチ)</label>
            <input
              type="number"
              id="diameter"
              name="diameter"
              value={formData.diameter}
              onChange={handleInputChange}
              placeholder="例: 16"
              min="13"
              max="22"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="brand">ブランド</label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand || 'すべてのブランド'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="model">銘柄</label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              disabled={!formData.brand}
            >
              {formData.brand === 'ブリヂストン' ? (
                bridgestoneModels.map(model => (
                  <option key={model} value={model}>
                    {model || 'すべての銘柄'}
                  </option>
                ))
              ) : (
                <option value="">ブランドを選択してください</option>
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">タイヤタイプ</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              {tireTypes.map(type => (
                <option key={type} value={type}>
                  {type || 'すべてのタイプ'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="carType">車種</label>
            <select
              id="carType"
              name="carType"
              value={formData.carType}
              onChange={handleInputChange}
            >
              {carTypes.map(carType => (
                <option key={carType.value} value={carType.value}>
                  {carType.label} (¥{carType.laborCost.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tireQuantity">タイヤ本数</label>
            <select
              id="tireQuantity"
              name="tireQuantity"
              value={formData.tireQuantity}
              onChange={handleInputChange}
            >
              <option value="1">1本</option>
              <option value="2">2本</option>
              <option value="3">3本</option>
              <option value="4">4本</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="airValve">エアバルブ (本)</label>
            <input
              type="number"
              id="airValve"
              name="airValve"
              value={formData.airValve}
              onChange={handleInputChange}
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tireDisposal">廃タイヤ (本)</label>
            <input
              type="number"
              id="tireDisposal"
              name="tireDisposal"
              value={formData.tireDisposal}
              onChange={handleInputChange}
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label htmlFor="maintenancePack">
              <input
                type="checkbox"
                id="maintenancePack"
                name="maintenancePack"
                checked={formData.maintenancePack}
                onChange={handleInputChange}
              />
              メンテナンスパック加入 (-¥{MAINTENANCE_PACK_DISCOUNT.toLocaleString()})
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleClear} className="clear-btn">
            🗑️ クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default TireSearchForm;
