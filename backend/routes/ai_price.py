from fastapi import APIRouter, HTTPException
import schemas
from ai.price_model import predict_price

router = APIRouter()

@router.post("/price", response_model=schemas.PriceResponse)
def get_price_suggestion(request: schemas.PriceRequest):
    try:
        price_min, price_max, suggested = predict_price(
            crop_type=request.crop_type,
            state=request.state,
            season=request.season,
            quantity=request.quantity
        )

        return {
            "crop_type": request.crop_type,
            "quantity": request.quantity,
            "price_min": price_min,
            "price_max": price_max,
            "suggested_price": suggested
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))