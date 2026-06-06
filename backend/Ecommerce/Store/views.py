from rest_framework import generics
from django.http import JsonResponse

from .models import Product
from .serializers import ProductSerializer


def home(request):
    return JsonResponse({
        "status": "ok"
    })


class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
