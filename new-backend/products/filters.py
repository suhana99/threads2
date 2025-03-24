import django_filters
from django.db.models import Q
from Levenshtein import ratio
from .models import Product

class ProductFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = ['category', 'product_price']

    def filter_search(self, queryset, name, value):
        """
        Uses Django `icontains` for broad filtering first,
        then applies fuzzy matching with Levenshtein ratio.
        """

        value = value.strip().lower()  # Normalize input

        # Step 1: Broad match using icontains
        filtered_queryset = queryset.filter(
            Q(product_name__icontains=value) |
            Q(product_description__icontains=value) |
            Q(category__category_name__icontains=value)
        )

        matched_products = []
        similarity_threshold = 10  # Set at 50% for better matching

        # Step 2: Apply fuzzy matching only on the filtered results
        for product in filtered_queryset:
            product_name = product.product_name.strip().lower()
            product_desc = product.product_description.strip().lower()
            product_category = (product.category.category_name.strip().lower() if product.category else "")

            name_similarity = ratio(value, product_name) * 100
            desc_similarity = ratio(value, product_desc) * 100
            category_similarity = ratio(value, product_category) * 100

            # Debugging print statements
            print(f"Comparing '{value}' with '{product_name}', similarity: {name_similarity}%")
            print(f"Comparing '{value}' with '{product_desc}', similarity: {desc_similarity}%")
            print(f"Comparing '{value}' with '{product_category}', similarity: {category_similarity}%")

            # If any field has 50%+ similarity, consider it a match
            if max(name_similarity, desc_similarity, category_similarity) >= similarity_threshold:
                matched_products.append(product.id)

        # Step 3: Return products that meet similarity criteria
        return queryset.filter(id__in=matched_products) if matched_products else queryset
