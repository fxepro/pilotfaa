from django.contrib import admin

from .models import (
    BundleItem,
    Product,
    ProductAttribute,
    ProductAttributeValue,
    ProductAuditLog,
    ProductBundle,
    ProductCategory,
    ProductCategoryLink,
    ProductFile,
    ProductImage,
    ProductRelationship,
    ProductStatusHistory,
    ProductTag,
    ProductTagLink,
    ProductVariant,
    SeoMetadata,
    VariantAttributeValue,
)


admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(ProductCategory)
admin.site.register(ProductCategoryLink)
admin.site.register(ProductTag)
admin.site.register(ProductTagLink)
admin.site.register(ProductImage)
admin.site.register(ProductFile)
admin.site.register(ProductAttribute)
admin.site.register(ProductAttributeValue)
admin.site.register(VariantAttributeValue)
admin.site.register(ProductRelationship)
admin.site.register(ProductBundle)
admin.site.register(BundleItem)
admin.site.register(ProductStatusHistory)
admin.site.register(ProductAuditLog)
admin.site.register(SeoMetadata)
