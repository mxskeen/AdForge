import boto3
import json
import base64
import os
from dotenv import load_dotenv

load_dotenv()


class BedrockClient:
    def __init__(self):
        self.client = boto3.client(
            "bedrock-runtime",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
        self.nova_lite = "amazon.nova-lite-v1:0"
        self.nova_canvas = "amazon.nova-canvas-v1:0"

    def _detect_format(self, image_base64: str) -> str:
        try:
            data = base64.b64decode(image_base64)
            if data[:3] == b'\xff\xd8\xff':
                return "jpeg"
            elif data[:8] == b'\x89PNG\r\n\x1a\n':
                return "png"
            return "jpeg"
        except:
            return "jpeg"

    def _parse_json(self, text: str) -> dict:
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(text[start:end])
        except:
            pass
        return {}

    def analyze_product_image(self, image_base64: str) -> dict:
        fmt = self._detect_format(image_base64)
        
        prompt = """Analyze this product image. Return JSON only:
{
    "name": "Product name",
    "category": "Category",
    "key_features": ["feature1", "feature2", "feature3"],
    "target_audience": "Target audience",
    "color_palette": ["#hex1", "#hex2"],
    "mood": "professional/playful/luxury/minimal"
}"""

        messages = [{
            "role": "user",
            "content": [
                {"image": {"format": fmt, "source": {"bytes": base64.b64decode(image_base64)}}},
                {"text": prompt},
            ],
        }]

        response = self.client.converse(
            modelId=self.nova_lite,
            messages=messages,
            inferenceConfig={"maxTokens": 1024, "temperature": 0.7},
        )

        result = self._parse_json(response["output"]["message"]["content"][0]["text"])
        
        return result or {
            "name": "Product",
            "category": "General",
            "key_features": ["Quality", "Value"],
            "target_audience": "General consumers",
            "color_palette": ["#000000", "#FFFFFF"],
            "mood": "professional",
        }

    def generate_marketing_copy(self, product: dict) -> dict:
        prompt = f"""Create marketing copy for {product.get('name', 'Product')} ({product.get('category', 'General')}).
Features: {', '.join(product.get('key_features', []))}
Target: {product.get('target_audience', 'General')}

Return JSON only:
{{
    "instagram_caption": "Caption with emojis",
    "email_subject": "Email subject line",
    "ad_headline": "Ad headline",
    "ad_body": "Ad body text",
    "hashtags": ["tag1", "tag2", "tag3"]
}}"""

        messages = [{"role": "user", "content": [{"text": prompt}]}]

        response = self.client.converse(
            modelId=self.nova_lite,
            messages=messages,
            inferenceConfig={"maxTokens": 1024, "temperature": 0.8},
        )

        result = self._parse_json(response["output"]["message"]["content"][0]["text"])
        
        return result or {
            "instagram_caption": f"Check out {product.get('name', 'our product')}!",
            "email_subject": f"Discover {product.get('name', 'Our Product')}",
            "ad_headline": f"{product.get('name', 'Product')} - Made for You",
            "ad_body": "Experience quality like never before.",
            "hashtags": ["newproduct", "trending", "musthave"],
        }

    def generate_styled_image(self, image_base64: str, product: dict, style: str = "professional") -> str:
        # Extract colors for context
        colors = ", ".join(product.get("color_palette", []))
        category = product.get("category", "product")
        
        # presets based on user references
        styles = {
            "professional": f"high-end commercial product photography of {product.get('name')}, soft studio lighting, pastel {colors} background, sharp focus, 8k, highly detailed, advertising standard, rule of thirds, vanilla bean and fruit props, clean composition",
            "luxury": f"cinematic 3D render style of {product.get('name')}, dramatic neon lighting, dark elegant background, floating elements, ray tracing, unreal engine 5 render, futuristic, premium advertising, glowing edges",
            "playful": f"artistic top-down shot of {product.get('name')}, textured background with smeared {colors} paint, high contrast, vibrant, pop art style, creative composition, social media trend",
            "minimal": f"architectural product photography of {product.get('name')}, pure solid background, hard shadows, geometric composition, design magazine style, 8k resolution",
        }

        selected_prompt = styles.get(style, styles["professional"])
        
        
        full_prompt = f"{selected_prompt}, masterpiece, professional color grading, sharp details, no text, no watermarks"

        body = json.dumps({
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": full_prompt,
                "negativeText": "text, watermark, low quality, blurry, distorted, deformed, ugly, bad anatomy, pixelated, grain"
            },
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "height": 1024,
                "width": 1024,
                "cfgScale": 9.0, 
            },
        })

        response = self.client.invoke_model(
            modelId=self.nova_canvas,
            body=body,
            contentType="application/json",
            accept="application/json",
        )

    def refine_copy(self, current_text: str, refinement_prompt: str, context: str) -> str:
        prompt = f"""Refine this marketing copy based on the user's request.

Context: {context}
Current Text: "{current_text}"
User Request: "{refinement_prompt}"

Return ONLY the refined text. Do not include quotes or explanations."""

        messages = [{"role": "user", "content": [{"text": prompt}]}]

        response = self.client.converse(
            modelId=self.nova_lite,
            messages=messages,
            inferenceConfig={"maxTokens": 512, "temperature": 0.7},
        )

        return response["output"]["message"]["content"][0]["text"].strip()



bedrock_client = BedrockClient()
