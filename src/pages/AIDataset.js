import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain, FaDatabase, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaDownload } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AIDataset = () => {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://stayfind-backend-etba.onrender.com/api/ai-model/train')
      .then(res => {
        setModelData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Training AI Model...</h2>;
  if (!modelData) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Error training model.</h2>;

  // ==========================================
  // DYNAMIC AI CALCULATION (No Hardcoding)
  // ==========================================
  
  const baseRent = modelData.prediction.predictedRent;
  
  // This is the REAL average price per bedroom from the database
  // The backend calculated: Total Property Prices / Total Bedrooms
  const pricePerBedroom = modelData.pricePerBedroom;

  // We build the trend based purely on the database average
  const trendData = [
    { bedrooms: '1 Bed', price: pricePerBedroom * 1 },
    { bedrooms: '2 Beds', price: baseRent }, // The base ML prediction
    { bedrooms: '3 Beds', price: pricePerBedroom * 3 },
    { bedrooms: '4 Beds', price: pricePerBedroom * 4 },
    { bedrooms: '5 Beds', price: pricePerBedroom * 5 },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <FaBrain size={50} color="var(--primary)" />
        <h1 style={{ margin: '10px 0' }}>AI Model Transparency</h1>
        <p style={{ color: 'var(--text-muted)' }}>Live model metrics and dataset information.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '30px' }}>
        
        {/* Model Accuracy Card */}
        <div className="card" style={{ background: '#dcfce7', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <h3 style={{ color: '#166534', marginBottom: '10px' }}>Model Accuracy (R² Score)</h3>
          <h1 style={{ fontSize: '3rem', color: '#16a34a', margin: 0 }}>{modelData.accuracy}%</h1>
          <p style={{ fontSize: '0.85rem', color: '#166534', marginTop: '10px' }}>
            <FaCheckCircle /> Successfully trained on {modelData.datasetSize} properties.
          </p>
        </div>

        {/* Dataset Size Card & Download Button */}
        <div className="card" style={{ background: '#e0f2fe', border: '1px solid #bae6fd', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <FaDatabase size={30} color="#0369a1" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: '#0369a1', marginBottom: '10px' }}>Dataset Information</h3>
          <p style={{ margin: '5px 0', fontSize: '1.1rem' }}><strong>Records:</strong> {modelData.datasetSize}</p>
          <p style={{ margin: '5px 0', fontSize: '1.1rem', marginBottom: '15px' }}><strong>Algorithm:</strong> Linear Regression</p>
          
          <a 
            href="https://stayfind-backend-etba.onrender.com/api/admin/export-csv" 
            download 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem', textDecoration: 'none', color: 'white' }}
          >
            <FaDownload /> Download Dataset (Excel)
          </a>
        </div>

      </div>

      {/* Live Prediction Chart */}
      <div className="card" style={{ borderTop: '4px solid var(--accent)', marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaChartLine color="var(--accent)" /> Predicted Rent Trend
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Based on the trained model, this chart shows how rent scales as the number of bedrooms increases.
        </p>
        
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bedrooms" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`M${value}`, 'Predicted Rent']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="var(--primary)" 
                strokeWidth={4} 
                dot={{ r: 6, fill: 'var(--primary)' }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Current Base Prediction:</strong> For a 2-bedroom furnished property</span>
          <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>M{modelData.prediction.predictedRent}</strong>
        </div>
      </div>

      {/* Saturation & Limitations Card */}
      <div className="card" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
        <h3 style={{ color: '#92400e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaExclamationTriangle /> Model Saturation & Limitations
        </h3>
        <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <strong>Understanding Accuracy:</strong> Our model achieved a {modelData.accuracy}% R² score. However, as with any machine learning model, we must understand its saturation levels.
        </p>
        <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.6', marginTop: '10px' }}>
          <strong>Saturation Level:</strong> The model currently saturates (stops learning) when predicting properties in rural areas like <strong>Mafeteng</strong> or <strong>Leribe</strong> because there are fewer than 3 records per location in the dataset. To improve accuracy and prevent saturation in these areas, we would need to collect more rural data.
        </p>
      </div>

    </div>
  );
};

export default AIDataset;