{
  "id": "evt_1S3cwWF7AkMH7YLCZVFNwkQI",
  "object": "event",
  "api_version": "2025-08-27.basil",
  "created": 1756991469,
  "data": {
    "object": {
      "id": "in_1S3cwJF7AkMH7YLC3XKITBry",
      "object": "invoice",
      "account_country": "JP",
      "account_name": "ployee",
      "account_tax_ids": null,
      "amount_due": 300,
      "amount_overpaid": 0,
      "amount_paid": 300,
      "amount_remaining": 0,
      "amount_shipping": 0,
      "application": null,
      "attempt_count": 0,
      "attempted": true,
      "auto_advance": false,
      "automatic_tax": {
        "disabled_reason": null,
        "enabled": false,
        "liability": null,
        "provider": null,
        "status": null
      },
      "automatically_finalizes_at": null,
      "billing_reason": "subscription_create",
      "collection_method": "charge_automatically",
      "created": 1756991459,
      "currency": "jpy",
      "custom_fields": null,
      "customer": "cus_Szb0UXGon16zZo",
      "customer_address": null,
      "customer_email": "itsukison@fuji.waseda.jp",
      "customer_name": "Itsuki",
      "customer_phone": null,
      "customer_shipping": null,
      "customer_tax_exempt": "none",
      "customer_tax_ids": [],
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [],
      "description": null,
      "discounts": [],
      "due_date": null,
      "effective_at": 1756991459,
      "ending_balance": 0,
      "footer": null,
      "from_invoice": null,
      "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1S2YAfF7AkMH7YLC/live_YWNjdF8xUzJZQWZGN0FrTUg3WUxDLF9TemNBZzZ1N0JxaG43VFFDUE1iR3k1ejNrZnk0SllNLDE0NzUzMjI3Mg0200mvAUu5tQ?s=ap",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_1S2YAfF7AkMH7YLC/live_YWNjdF8xUzJZQWZGN0FrTUg3WUxDLF9TemNBZzZ1N0JxaG43VFFDUE1iR3k1ejNrZnk0SllNLDE0NzUzMjI3Mg0200mvAUu5tQ/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "object": "list",
        "data": [
          {
            "id": "il_1S3cwJF7AkMH7YLCfyvCikwG",
            "object": "line_item",
            "amount": 300,
            "currency": "jpy",
            "description": "1 × ベーシック (at ¥300 / month)",
            "discount_amounts": [],
            "discountable": true,
            "discounts": [],
            "invoice": "in_1S3cwJF7AkMH7YLC3XKITBry",
            "livemode": true,
            "metadata": {
              "userId": "41b28551-fb40-4ea1-9770-39d1fab659be",
              "planId": "basic"
            },
            "parent": {
              "invoice_item_details": null,
              "subscription_item_details": {
                "invoice_item": null,
                "proration": false,
                "proration_details": {
                  "credited_items": null
                },
                "subscription": "sub_1S3cwQF7AkMH7YLCHmZqXeFI",
                "subscription_item": "si_SzcA8CbhpnAJlM"
              },
              "type": "subscription_item_details"
            },
            "period": {
              "end": 1759583459,
              "start": 1756991459
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_1S3Ya3F7AkMH7YLCYER68bt1",
                "product": "prod_SzXf9ExAZxvcx3"
              },
              "type": "price_details",
              "unit_amount_decimal": "300"
            },
            "quantity": 1,
            "taxes": []
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/invoices/in_1S3cwJF7AkMH7YLC3XKITBry/lines"
      },
      "livemode": true,
      "metadata": {},
      "next_payment_attempt": null,
      "number": "N30CCNX4-0002",
      "on_behalf_of": null,
      "parent": {
        "quote_details": null,
        "subscription_details": {
          "metadata": {
            "userId": "41b28551-fb40-4ea1-9770-39d1fab659be",
            "planId": "basic"
          },
          "subscription": "sub_1S3cwQF7AkMH7YLCHmZqXeFI"
        },
        "type": "subscription_details"
      },
      "payment_settings": {
        "default_mandate": null,
        "payment_method_options": {
          "acss_debit": null,
          "bancontact": null,
          "card": {
            "request_three_d_secure": "automatic"
          },
          "customer_balance": null,
          "konbini": null,
          "sepa_debit": null,
          "us_bank_account": null
        },
        "payment_method_types": [
          "card"
        ]
      },
      "period_end": 1756991459,
      "period_start": 1756991459,
      "post_payment_credit_notes_amount": 0,
      "pre_payment_credit_notes_amount": 0,
      "receipt_number": null,
      "rendering": null,
      "shipping_cost": null,
      "shipping_details": null,
      "starting_balance": 0,
      "statement_descriptor": null,
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1756991459,
        "marked_uncollectible_at": null,
        "paid_at": 1756991463,
        "voided_at": null
      },
      "subtotal": 300,
      "subtotal_excluding_tax": 300,
      "test_clock": null,
      "total": 300,
      "total_discount_amounts": [],
      "total_excluding_tax": 300,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1756991459
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "invoice.payment_succeeded"
}