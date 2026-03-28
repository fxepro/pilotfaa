import uuid
from django.conf import settings
from django.db import models


SCHEMA = "products"


def schema_table(table):
    return f'{SCHEMA}"."{table}'


class ProductCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children"
    )
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = schema_table("product_categories")
        indexes = [
            models.Index(fields=["store_id", "slug"]),
            models.Index(fields=["parent"]),
        ]

    def __str__(self):
        return self.name


class ProductTag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_tags")
        indexes = [
            models.Index(fields=["store_id", "slug"]),
        ]

    def __str__(self):
        return self.name


class Product(models.Model):
    PRODUCT_TYPES = (
        ("physical", "Physical"),
        ("digital", "Digital"),
        ("subscription", "Subscription"),
        ("bundle", "Bundle"),
    )
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
        ("unlisted", "Unlisted"),
    )
    VISIBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
        ("password", "Password Protected"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    product_type = models.CharField(max_length=30, choices=PRODUCT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default="public")
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    default_sku = models.CharField(max_length=100, blank=True)
    featured = models.BooleanField(default=False)
    requires_shipping = models.BooleanField(default=True)
    allow_reviews = models.BooleanField(default=True)
    tax_class_id = models.UUIDField(null=True, blank=True)
    shipping_class_id = models.UUIDField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="products_updated",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    categories = models.ManyToManyField(ProductCategory, through="ProductCategoryLink")
    tags = models.ManyToManyField(ProductTag, through="ProductTagLink")

    class Meta:
        db_table = schema_table("products")
        indexes = [
            models.Index(fields=["store_id", "slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["product_type"]),
        ]

    def __str__(self):
        return self.name


class ProductCategoryLink(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_category_links")
        unique_together = ("product", "category")


class ProductTagLink(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    tag = models.ForeignKey(ProductTag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_tag_links")
        unique_together = ("product", "tag")


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    url = models.TextField()
    alt_text = models.CharField(max_length=255, blank=True)
    sort_order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_images")
        indexes = [
            models.Index(fields=["product"]),
        ]


class ProductFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="files")
    file_name = models.CharField(max_length=255)
    file_url = models.TextField()
    file_size = models.BigIntegerField()
    content_type = models.CharField(max_length=100, blank=True)
    download_limit = models.IntegerField(null=True, blank=True)
    download_expiry_days = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_files")
        indexes = [
            models.Index(fields=["product"]),
        ]


class ProductAttribute(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_attributes")
        indexes = [
            models.Index(fields=["store_id", "name"]),
        ]

    def __str__(self):
        return self.display_name


class ProductAttributeValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attribute = models.ForeignKey(
        ProductAttribute, on_delete=models.CASCADE, related_name="values"
    )
    value = models.CharField(max_length=100)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = schema_table("product_attribute_values")
        indexes = [
            models.Index(fields=["attribute"]),
        ]

    def __str__(self):
        return self.value


class ProductVariant(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, blank=True)
    barcode = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    price_override = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    compare_at_price_override = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    cost_price_override = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    weight = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    weight_unit = models.CharField(max_length=10, default="lb")
    image = models.ForeignKey(
        ProductImage, null=True, blank=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = schema_table("product_variants")
        indexes = [
            models.Index(fields=["product"]),
            models.Index(fields=["sku"]),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class VariantAttributeValue(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(ProductAttributeValue, on_delete=models.CASCADE)

    class Meta:
        db_table = schema_table("variant_attribute_values")
        unique_together = ("variant", "attribute_value")


class ProductRelationship(models.Model):
    RELATIONSHIP_CHOICES = (
        ("cross_sell", "Cross-sell"),
        ("up_sell", "Up-sell"),
        ("related", "Related"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="relationships")
    related_product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="related_to"
    )
    relationship_type = models.CharField(max_length=50, choices=RELATIONSHIP_CHOICES)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = schema_table("product_relationships")
        indexes = [
            models.Index(fields=["product"]),
        ]


class ProductBundle(models.Model):
    PRICING_MODES = (
        ("fixed", "Fixed"),
        ("calculated", "Calculated"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="bundle")
    pricing_mode = models.CharField(max_length=50, choices=PRICING_MODES, default="fixed")
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_bundles")


class BundleItem(models.Model):
    bundle = models.ForeignKey(ProductBundle, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.IntegerField(default=1)

    class Meta:
        db_table = schema_table("bundle_items")
        unique_together = ("bundle", "product", "variant")


class ProductStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="status_history")
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_status_history")
        indexes = [
            models.Index(fields=["product"]),
        ]


class ProductAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="audit_logs")
    action = models.CharField(max_length=50)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    changes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("product_audit_logs")
        indexes = [
            models.Index(fields=["product"]),
        ]


class SeoMetadata(models.Model):
    ENTITY_CHOICES = (
        ("product", "Product"),
        ("category", "Category"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entity_type = models.CharField(max_length=50, choices=ENTITY_CHOICES)
    entity_id = models.UUIDField()
    seo_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    og_image_url = models.TextField(blank=True)
    canonical_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = schema_table("seo_metadata")
        indexes = [
            models.Index(fields=["entity_type", "entity_id"]),
        ]
