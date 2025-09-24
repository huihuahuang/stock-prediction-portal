from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts import views as UserViews
from .views import StockPredictionAPIView
urlpatterns = [
    path("register/", UserViews.RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/', UserViews.ProtectedView.as_view()),
    path('predict/', StockPredictionAPIView.as_view(), name="stock-prediction")
] 