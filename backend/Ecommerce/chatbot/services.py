import re
from decimal import Decimal, InvalidOperation

import google.generativeai as genai
from django.conf import settings
from django.db.models import Q

from Store.models import Product

genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

PRODUCT_QUERY_KEYWORDS = [
    "product",
    "products",
    "price",
    "available",
    "inventory",
    "stock",
    "size",
    "color",
    "category",
    "subcategory",
    "discount",
    "discounted",
    "sale",
    "new arrival",
    "new arrivals",
    "bestseller",
    "bestsellers",
    "under",
    "cheapest",
    "affordable",
    "men",
    "women",
    "mens",
    "womens",
    "male",
    "female",
    "man",
    "woman",
    "shirt",
    "shirts",
    "pants",
    "jeans",
    "dress",
    "dresses",
    "hoodie",
    "hoodies",
    "top",
    "tops",
    "skirt",
    "skirts",
]

PRICE_PATTERN = re.compile(
    r"(?:under|below|less than|up to)\s*(?:[\$€£¥])?\s*(\d+(?:\.\d+)?)\s*(?:[\$€£¥]|dollars?|usd|eur|euro|pounds?|lbs|yen)?\b",
    re.IGNORECASE
)


def format_product_response(products):
    lines = [
        "I found the following matching products in our store database:",
        ""
    ]

    for product in products[:5]:
        effective_price = (
            product.discount_price if product.discount_price is not None else product.price
        )
        price = f"${effective_price:.2f}"
        labels = []
        if product.is_bestseller:
            labels.append("bestseller")
        if product.is_new_arrival:
            labels.append("new arrival")
        if product.is_under_ten:
            labels.append("under $10")
        if product.discount_price is not None and product.discount_price < product.price:
            labels.append("discounted")

        label_text = f" ({', '.join(labels)})" if labels else ""
        availability = "In stock" if product.available else "Out of stock"

        lines.extend([
            f"• {product.name}",
            f"  Category: {product.category}/{product.subcategory}",
            f"  Price: {price}{label_text}",
            f"  Availability: {availability}",
        ])

        if product.discount_price is not None and product.discount_price < product.price:
            lines.append(f"  Discounted from ${product.price:.2f}")

        lines.append(f"  View product: /product-detail/{product.id}")
        lines.append("")

    lines.append(
        "If you want, ask me to narrow the search by color, size, or price range."
    )
    return "\n".join(lines)


def find_products_in_db(message):
    text = message.lower().strip()
    if not text:
        return Product.objects.none()

    products = Product.objects.filter(available=True)

    price_match = PRICE_PATTERN.search(text)
    if price_match:
        try:
            price_limit = Decimal(price_match.group(1))
            products = products.filter(
                Q(price__lte=price_limit) | Q(discount_price__lte=price_limit)
            )
        except (InvalidOperation, ValueError):
            pass

    if "new arrival" in text or "new arrivals" in text:
        products = products.filter(is_new_arrival=True)
    if "bestseller" in text or "best seller" in text:
        products = products.filter(is_bestseller=True)
    if "under 10" in text or "under ten" in text or "< $10" in text or "<$10" in text:
        products = products.filter(is_under_ten=True)

    men_terms = {"men", "mens", "man", "male", "guy", "gent", "gents"}
    women_terms = {"women", "womens", "woman", "female", "lady", "ladies"}
    tokens = set(re.findall(r"\b[a-z]+\b", text))
    contains_men = bool(tokens & men_terms)
    contains_women = bool(tokens & women_terms)

    if contains_men and not contains_women:
        products = products.filter(category=Product.CATEGORY_MEN)
    if contains_women and not contains_men:
        products = products.filter(category=Product.CATEGORY_WOMEN)

    tokens = [
        token for token in re.findall(r"\b[a-z0-9]+\b", text)
        if len(token) > 2 and token not in {
            "show", "me", "please", "what", "the", "this", "that", "and",
            "for", "with", "from", "your", "you", "want", "looking",
            "find", "finds", "findings", "need", "good", "best", "have",
            "under", "below", "less", "than", "in", "on", "of", "to",
            "a", "an", "it", "is", "are", "be", "can",
        }
    ]

    if tokens:
        search_query = Q()
        for token in tokens:
            search_query |= (
                Q(name__icontains=token) |
                Q(description__icontains=token) |
                Q(category__icontains=token) |
                Q(subcategory__icontains=token)
            )
        products = products.filter(search_query)

    return products.order_by("-is_featured", "-is_new_arrival", "name")[:10]


def user_query_about_products(message):
    query = message.lower()
    pattern = r"\b(" + "|".join(re.escape(keyword)
                                for keyword in PRODUCT_QUERY_KEYWORDS) + r")\b"
    return bool(re.search(pattern, query))


def ask_gemini(message):
    products = find_products_in_db(message)
    is_product_query = user_query_about_products(message)

    if is_product_query and products.exists():
        return format_product_response(products)

    if is_product_query and not products.exists():
        return (
            "I searched our product database but didn't find any items matching your request. "
            "Try changing the category, color, size, or price range, and I'll search again."
        )

    response = model.generate_content(
        message
    )

    return response.text
