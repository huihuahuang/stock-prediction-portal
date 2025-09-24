import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const Dashboard = () => {
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plot, setPlot] = useState(null);
  const [ma100, setMA1OO] = useState(null);
  const [ma200, setMA2OO] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [mse, setMSE] = useState(null);
  const [rmse, setRMSE] = useState(null);
  const [r2, setR2] = useState(null);
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get('/protected-view');
        if (response.data.error) {
          setError(response.data.error);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchProtectedData();
  }, []);

  const resetResults = () => {
    setPlot(null);
    setMA1OO(null);
    setMA2OO(null);
    setPrediction(null);
    setMSE(null);
    setRMSE(null);
    setR2(null);
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    resetResults();
    try {
      const response = await axiosInstance.post('/predict/', {
        ticker: ticker,
      });
      const backendRoot = import.meta.env.VITE_BACKEND_ROOT_URL;
      const plotUrl = `${backendRoot}${response.data.plot_img}`;
      const ma100Url = `${backendRoot}${response.data.plot_100_dma}`;
      const ma200Url = `${backendRoot}${response.data.plot_200_dma}`;
      const predictionUrl = `${backendRoot}${response.data.final_prediction}`;
      setPlot(plotUrl);
      setMA1OO(ma100Url);
      setMA2OO(ma200Url);
      setPrediction(predictionUrl);
      setMSE(response.data.mse);
      setRMSE(response.data.rmse);
      setR2(response.data.r2);
    } catch (err) {
      console.log(err);
      resetResults();
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = prediction && mse != null && rmse != null && r2 != null;
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Stock Ticker"
              onChange={(e) => setTicker(e.target.value)}
              required
            />
            <small>{error && <div className="text-danger">{error}</div>}</small>
            <button type="submit" className="btn btn-info mt-3">
              {isLoading ? (
                <span>
                  {' '}
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Please wait...
                </span>
              ) : (
                'See Prediction'
              )}
            </button>
          </form>
          {prediction && (
            <div className="prediction mt-5">
              <div className="p-5">
                {plot && (
                  <img
                    src={plot}
                    alt="Plot Image"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ maxWidth: '100%' }}
                  />
                )}
              </div>
              <div className="p-5">
                {ma100 && (
                  <img
                    src={ma100}
                    alt="MA 100 Image"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ maxWidth: '100%' }}
                  />
                )}
              </div>
              <div className="p-5">
                {ma200 && (
                  <img
                    src={ma200}
                    alt="MA 200 Image"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ maxWidth: '100%' }}
                  />
                )}
              </div>
              <div className="p-5">
                {prediction && (
                  <img
                    src={prediction}
                    alt="Prediction Image"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ maxWidth: '100%' }}
                  />
                )}
              </div>
              <div className="text-light p-3">
                {hasResults && (
                  <>
                    <h4>Model Evaluation</h4>
                    <p>Mean Squared Error: {mse}</p>
                    <p>Root Mean Squared Error: {rmse}</p>
                    <p>R-squared: {r2}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
