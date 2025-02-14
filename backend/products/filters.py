import django_filters
from .models import Product
class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    class Meta:
        id = django_filters.CharFilter(field_name='id', lookup_expr='icontains')
        category=django_filters.CharFilter(field_name='category',lookup_expr='icontains')
        model = Product
        fields = ['id','min_price','max_price','category']