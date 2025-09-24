from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from keras.models import load_model
import os
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from .serializers import StockPredictionSerializer
from .utils import save_plot


# Create your views here.
class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data["ticker"]
            # Fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year-10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)
            if df.empty:
                return Response({"error": "No data found for the given ticker.",
                                 "status": status.HTTP_404_NOT_FOUND})
            # Normalize the data
            df = df.reset_index()

            # Generate basic plot
            # Use AGG backend to render plots into an in-memory canvas
            # Save it on the image file
            plt.switch_backend("AGG")
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label="Closing Price")
            plt.title(f"Closing Price of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            # Save the plot to a file
            plot_img_path = f"{ticker}_plot.jpg"
            save_plot(plot_img_path)
            plot_img = settings.MEDIA_URL + plot_img_path

            # 100 Days moving average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend("AGG")
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label="Closing Price")
            plt.plot(ma100, "r", label="100 DMA")
            plt.title(f"100 Days moving average of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            plot_100_img_path = f"{ticker}_100_dma.jpg"
            save_plot(plot_100_img_path)
            plot_100_dma = settings.MEDIA_URL + plot_100_img_path

            # 200 Days moving average
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend("AGG")
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label="Closing Price")
            plt.plot(ma100, "r", label="100 DMA")
            plt.plot(ma200, "g", label="200 DMA")

            plt.title(f"200 Days moving average of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            plot_200_img_path = f"{ticker}_200_dma.jpg"
            save_plot(plot_200_img_path)
            plot_200_dma = settings.MEDIA_URL + plot_200_img_path

            # Make prediction
            # Splitting data into Training and Testing datasets
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7): int(len(df))])
            # Scale down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))
            # Load ML Model
            model = load_model("Stock_prediction_model.keras")
            # Prepare test data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i, 0])

            x_test, y_test = np.array(x_test), np.array(y_test)

            # Making Prediction
            y_predicted = model.predict(x_test)

            # Revert the scaled prices to original prices
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            # plot the final prediction
             # 200 Days moving average
            plt.switch_backend("AGG")
            plt.figure(figsize=(12, 5))
            plt.plot(y_test, "b", label="Original Price")
            plt.plot(y_predicted, "r", label="Predicted Price")

            plt.title(f"Final Prediction of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            plot_final_img_path = f"{ticker}_final_dma.jpg"
            save_plot(plot_final_img_path)
            plot_final = settings.MEDIA_URL + plot_final_img_path
            
            # Model evaluation
            # Mean Squared Error (MSE)
            mse = mean_squared_error(y_test, y_predicted)

            # Root Mean Squared Error(RMSE)
            rmse = np.sqrt(mse)

            r2 = r2_score(y_test, y_predicted)

            
            return Response({'status': 'success', 
                             'plot_img': plot_img, 
                             "plot_100_dma": plot_100_dma,
                             "plot_200_dma": plot_200_dma,
                             "final_prediction": plot_final,
                             "mse": mse,
                             "rmse": rmse,
                             "r2": r2})