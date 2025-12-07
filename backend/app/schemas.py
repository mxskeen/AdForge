from pydantic import BaseModel
from typing import List, Optional


class ProductAnalysis(BaseModel):
    name: str
    category: str
    key_features: List[str]
    target_audience: str
    color_palette: List[str]
    mood: str


class MarketingCopy(BaseModel):
    instagram_caption: str
    email_subject: str
    ad_headline: str
    ad_body: str
    hashtags: List[str]


class CampaignResponse(BaseModel):
    product_analysis: ProductAnalysis
    marketing_copy: MarketingCopy
    styled_image: Optional[str] = None
    original_image: Optional[str] = None


class CampaignRequest(BaseModel):
    image: str
    style: Optional[str] = "professional"


class RefineRequest(BaseModel):
    current_text: str
    refinement_prompt: str
    context: str  # e.g., "instagram_caption"
