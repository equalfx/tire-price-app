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
    minPrice: '',
    maxPrice: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // ブランドが変更されたらモデルをリセット
      ...(name === 'brand' ? { model: '' } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleClear = () => {
    setFormData({
      width: '',
      aspectRatio: '',
      diameter: '',
      brand: '',
      model: '',
      type: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="search-form-container">
      <h2>🔍 タイヤ検索</h2>
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
            <label htmlFor="minPrice">最低価格 (円)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
              placeholder="例: 10000"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxPrice">最高価格 (円)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleInputChange}
              placeholder="例: 100000"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="search-btn">
            🔍 検索
          </button>
          <button type="button" onClick={handleClear} className="clear-btn">
            🗑️ クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default TireSearchForm;
