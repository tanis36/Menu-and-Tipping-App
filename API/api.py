from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"

class PaymentRequest(BaseModel):
    amount: float

def get_paypal_access_token():
    response = requests.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"}
    )
    response.raise_for_status()
    return response.json()["access_token"]

@app.post("/create-paypal-order")
async def create_paypal_order(request: PaymentRequest):
    access_token = get_paypal_access_token()
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [{"amount": {"currency_code": "USD", "value": f"{request.amount:.2f}"}}]
    }

    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders", json=order_data, headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=500, detail="Failsed to create PayPal order")
    return {"orderID": response.json()["id"]}

@app.post("/capture-paypal-order/{order_id}")
async def capture_paypal_order(order_id: str):
    access_token = get_paypal_access_token()
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=500, detail="Failed to capture PayPal order")
    return response.json()