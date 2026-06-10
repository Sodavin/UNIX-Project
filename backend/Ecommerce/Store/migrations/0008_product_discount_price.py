from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Store', '0007_remove_order_items_orderitem_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='discount_price',
            field=models.DecimalField(
                blank=True, decimal_places=2, default=None, max_digits=8, null=True),
        ),
    ]
