{
  "id": "evt_1S3cwWF7AkMH7YLC0VNuq9l7",
  "object": "event",
  "api_version": "2025-08-27.basil",
  "created": 1756991470,
  "data": {
    "object": {
      "id": "sub_1S3cwQF7AkMH7YLCHmZqXeFI",
      "object": "subscription",
      "application": null,
      "application_fee_percent": null,
      "automatic_tax": {
        "disabled_reason": null,
        "enabled": false,
        "liability": null
      },
      "billing_cycle_anchor": 1756991459,
      "billing_cycle_anchor_config": null,
      "billing_mode": {
        "type": "classic"
      },
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "cancellation_details": {
        "comment": null,
        "feedback": null,
        "reason": null
      },
      "collection_method": "charge_automatically",
      "created": 1756991459,
      "currency": "jpy",
      "customer": "cus_Szb0UXGon16zZo",
      "days_until_due": null,
      "default_payment_method": "pm_1S3cwIF7AkMH7YLCYONvVtjY",
      "default_source": null,
      "default_tax_rates": [],
      "description": null,
      "discounts": [],
      "ended_at": null,
      "invoice_settings": {
        "account_tax_ids": null,
        "issuer": {
          "type": "self"
        }
      },
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_SzcA8CbhpnAJlM",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1756991460,
            "current_period_end": 1759583459,
            "current_period_start": 1756991459,
            "discounts": [],
            "metadata": {},
            "plan": {
              "id": "price_1S3Ya3F7AkMH7YLCYER68bt1",
              "object": "plan",
              "active": true,
              "amount": 300,
              "amount_decimal": "300",
              "billing_scheme": "per_unit",
              "created": 1756974703,
              "currency": "jpy",
              "interval": "month",
              "interval_count": 1,
              "livemode": true,
              "metadata": {},
              "meter": null,
              "nickname": null,
              "product": "prod_SzXf9ExAZxvcx3",
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "price_1S3Ya3F7AkMH7YLCYER68bt1",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1756974703,
              "currency": "jpy",
              "custom_unit_amount": null,
              "livemode": true,
              "lookup_key": null,
              "metadata": {},
              "nickname": null,
              "product": "prod_SzXf9ExAZxvcx3",
              "recurring": {
                "interval": "month",
                "interval_count": 1,
                "meter": null,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 300,
              "unit_amount_decimal": "300"
            },
            "quantity": 1,
            "subscription": "sub_1S3cwQF7AkMH7YLCHmZqXeFI",
            "tax_rates": []
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_1S3cwQF7AkMH7YLCHmZqXeFI"
      },
      "latest_invoice": "in_1S3cwJF7AkMH7YLC3XKITBry",
      "livemode": true,
      "metadata": {
        "userId": "41b28551-fb40-4ea1-9770-39d1fab659be",
        "planId": "basic"
      },
      "next_pending_invoice_item_invoice": null,
      "on_behalf_of": null,
      "pause_collection": null,
      "payment_settings": {
        "payment_method_options": {
          "acss_debit": null,
          "bancontact": null,
          "card": {
            "network": null,
            "request_three_d_secure": "automatic"
          },
          "customer_balance": null,
          "konbini": null,
          "sepa_debit": null,
          "us_bank_account": null
        },
        "payment_method_types": [
          "card"
        ],
        "save_default_payment_method": "off"
      },
      "pending_invoice_item_interval": null,
      "pending_setup_intent": null,
      "pending_update": null,
      "plan": {
        "id": "price_1S3Ya3F7AkMH7YLCYER68bt1",
        "object": "plan",
        "active": true,
        "amount": 300,
        "amount_decimal": "300",
        "billing_scheme": "per_unit",
        "created": 1756974703,
        "currency": "jpy",
        "interval": "month",
        "interval_count": 1,
        "livemode": true,
        "metadata": {},
        "meter": null,
        "nickname": null,
        "product": "prod_SzXf9ExAZxvcx3",
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start_date": 1756991459,
      "status": "active",
      "test_clock": null,
      "transfer_data": null,
      "trial_end": null,
      "trial_settings": {
        "end_behavior": {
          "missing_payment_method": "create_invoice"
        }
      },
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "customer.subscription.created"
}