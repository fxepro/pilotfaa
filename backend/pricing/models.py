import uuid
from django.db import models


SCHEMA = "pricing"


def schema_table(table):
    return f'{SCHEMA}"."{table}'


class PriceBook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=200)
    currency = models.CharField(max_length=10, default="USD")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("price_books")
        indexes = [
            models.Index(fields=["store_id"]),
            models.Index(fields=["store_id", "is_default"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.currency})"


class Price(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price_book = models.ForeignKey(PriceBook, on_delete=models.CASCADE, related_name="prices")
    product_id = models.UUIDField(null=True, blank=True)
    variant_id = models.UUIDField(null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    compare_at_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    cost_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("prices")
        indexes = [
            models.Index(fields=["price_book"]),
            models.Index(fields=["product_id"]),
            models.Index(fields=["variant_id"]),
        ]

    def __str__(self):
        return f"{self.amount} {self.price_book.currency}"
