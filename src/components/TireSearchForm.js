import React, { useState } from 'react';
import './TireSearchForm.css';

const TireSearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    width: '',
    aspectRatio: '',
    diameter: '',
    brand: '',
    model: '',
    type: ''
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
    const newFormData = {
      ...formData,
      [name]: value,
      // ブランドが変更されたらモデルをリセット
      ...(name === 'brand' ? { model: '' } : {})
    };
    
    setFormData(newFormData);
    
    // サイズと種類が選択されたら自動検索
    if (name === 'width' || name === 'aspectRatio' || name === 'diameter' || 
        name === 'brand' || name === 'model' || name === 'type') {
      const hasSize = newFormData.width || newFormData.aspectRatio || newFormData.diameter;
      const hasType = newFormData.type;
      
      if (hasSize || hasType) {
        onSearch(newFormData);
      }
    }
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
      type: ''
    });
  };

  return (
    <div className="search-form-container">
      <h2>🔍 ブリヂストン冬タイヤ検索</h2>
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
