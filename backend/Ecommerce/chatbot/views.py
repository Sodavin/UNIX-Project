from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import logging

from .services import ask_gemini

logger = logging.getLogger(__name__)


class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            message = request.data.get("message")

            if not message:
                return Response({
                    "reply": "Please provide a message."
                }, status=status.HTTP_400_BAD_REQUEST)

            reply = ask_gemini(message)

            return Response({
                "reply": reply
            })
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}", exc_info=True)
            return Response({
                "reply": f"Error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
