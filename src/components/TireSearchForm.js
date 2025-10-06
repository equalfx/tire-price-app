import React, { useState } from 'react';
import './TireSearchForm.css';

const TireSearchForm = ({ onSearch }) => {
        const [formData, setFormData] = useState({
          tireSize: '', // タイヤサイズ選択
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

  // 一般的なタイヤサイズ（実際のCSVデータから抽出）
  const tireSizes = [
    { width: '', aspectRatio: '', diameter: '', label: 'サイズを選択してください' },
    { width: '165', aspectRatio: '65', diameter: '14', label: '165/65R14' },
    { width: '175', aspectRatio: '65', diameter: '14', label: '175/65R14' },
    { width: '185', aspectRatio: '60', diameter: '14', label: '185/60R14' },
    { width: '185', aspectRatio: '65', diameter: '14', label: '185/65R14' },
    { width: '175', aspectRatio: '65', diameter: '15', label: '175/65R15' },
    { width: '185', aspectRatio: '60', diameter: '15', label: '185/60R15' },
    { width: '185', aspectRatio: '65', diameter: '15', label: '185/65R15' },
    { width: '195', aspectRatio: '60', diameter: '15', label: '195/60R15' },
    { width: '195', aspectRatio: '65', diameter: '15', label: '195/65R15' },
    { width: '205', aspectRatio: '60', diameter: '15', label: '205/60R15' },
    { width: '205', aspectRatio: '65', diameter: '15', label: '205/65R15' },
    { width: '185', aspectRatio: '55', diameter: '16', label: '185/55R16' },
    { width: '195', aspectRatio: '50', diameter: '16', label: '195/50R16' },
    { width: '195', aspectRatio: '55', diameter: '16', label: '195/55R16' },
    { width: '195', aspectRatio: '60', diameter: '16', label: '195/60R16' },
    { width: '205', aspectRatio: '50', diameter: '16', label: '205/50R16' },
    { width: '205', aspectRatio: '55', diameter: '16', label: '205/55R16' },
    { width: '205', aspectRatio: '60', diameter: '16', label: '205/60R16' },
    { width: '215', aspectRatio: '55', diameter: '16', label: '215/55R16' },
    { width: '225', aspectRatio: '50', diameter: '16', label: '225/50R16' },
    { width: '225', aspectRatio: '55', diameter: '16', label: '225/55R16' },
    { width: '195', aspectRatio: '50', diameter: '17', label: '195/50R17' },
    { width: '205', aspectRatio: '45', diameter: '17', label: '205/45R17' },
    { width: '205', aspectRatio: '50', diameter: '17', label: '205/50R17' },
    { width: '215', aspectRatio: '45', diameter: '17', label: '215/45R17' },
    { width: '215', aspectRatio: '50', diameter: '17', label: '215/50R17' },
    { width: '225', aspectRatio: '45', diameter: '17', label: '225/45R17' },
    { width: '225', aspectRatio: '50', diameter: '17', label: '225/50R17' },
    { width: '235', aspectRatio: '45', diameter: '17', label: '235/45R17' },
    { width: '205', aspectRatio: '40', diameter: '18', label: '205/40R18' },
    { width: '215', aspectRatio: '40', diameter: '18', label: '215/40R18' },
    { width: '215', aspectRatio: '45', diameter: '18', label: '215/45R18' },
    { width: '225', aspectRatio: '40', diameter: '18', label: '225/40R18' },
    { width: '225', aspectRatio: '45', diameter: '18', label: '225/45R18' },
    { width: '235', aspectRatio: '40', diameter: '18', label: '235/40R18' },
    { width: '235', aspectRatio: '45', diameter: '18', label: '235/45R18' },
    { width: '245', aspectRatio: '40', diameter: '18', label: '245/40R18' },
    { width: '255', aspectRatio: '40', diameter: '18', label: '255/40R18' },
    { width: '225', aspectRatio: '35', diameter: '19', label: '225/35R19' },
    { width: '235', aspectRatio: '35', diameter: '19', label: '235/35R19' },
    { width: '245', aspectRatio: '35', diameter: '19', label: '245/35R19' },
    { width: '255', aspectRatio: '35', diameter: '19', label: '255/35R19' },
    { width: '265', aspectRatio: '35', diameter: '19', label: '265/35R19' }
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
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      // ブランドが変更されたらモデルをリセット
      ...(name === 'brand' ? { model: '' } : {})
    };

    // タイヤサイズが選択された場合、width, aspectRatio, diameterを設定
    if (name === 'tireSize') {
      const selectedSize = tireSizes.find(size => size.label === value);
      if (selectedSize && selectedSize.width) {
        newFormData = {
          ...newFormData,
          width: selectedSize.width,
          aspectRatio: selectedSize.aspectRatio,
          diameter: selectedSize.diameter
        };
      } else {
        newFormData = {
          ...newFormData,
          width: '',
          aspectRatio: '',
          diameter: ''
        };
      }
    }
    
    setFormData(newFormData);
    
    // サイズと種類が選択されたら自動検索
    if (name === 'tireSize' || name === 'brand' || name === 'model' || name === 'type' || name === 'carType' ||
        name === 'maintenancePack' || name === 'airValve' || name === 'tireDisposal' || name === 'tireQuantity') {
      const hasSize = newFormData.tireSize || newFormData.width || newFormData.aspectRatio || newFormData.diameter;
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
      tireSize: '',
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
            <label htmlFor="tireSize">タイヤサイズ</label>
            <select
              id="tireSize"
              name="tireSize"
              value={formData.tireSize}
              onChange={handleInputChange}
            >
              {tireSizes.map(size => (
                <option key={size.label} value={size.label}>
                  {size.label}
                </option>
              ))}
            </select>
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
