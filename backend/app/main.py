from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from .schemas import CampaignRequest, CampaignResponse, ProductAnalysis, MarketingCopy, RefineRequest
from .bedrock import bedrock_client


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AdForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "AdForge API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/campaign", response_model=CampaignResponse)
async def generate_campaign(request: CampaignRequest):
    try:
        logger.info("Analyzing product image")
        product_dict = bedrock_client.analyze_product_image(request.image)
        product = ProductAnalysis(**product_dict)
        
        logger.info("Generating marketing copy")
        copy_dict = bedrock_client.generate_marketing_copy(product_dict)
        copy = MarketingCopy(**copy_dict)
        
        logger.info("Generating styled image")
        styled = bedrock_client.generate_styled_image(
            request.image, product_dict, request.style or "professional"
        )
        
        return CampaignResponse(
            product_analysis=product,
            marketing_copy=copy,
            styled_image=styled,
            original_image=request.image,
        )
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/refine")
async def refine_copy(request: RefineRequest):
    try:
        refined_text = bedrock_client.refine_copy(
            request.current_text, request.refinement_prompt, request.context
        )
        return {"refined_text": refined_text}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
