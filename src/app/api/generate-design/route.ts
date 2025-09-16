import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CreditService } from '@/lib/credit-service';

// Helper function to refund credits on API failure
async function refundCredits(userId: string, description: string) {
  try {
    await CreditService.addCredits(userId, 1, description);
  } catch (error) {
    console.error('Failed to refund credits:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    let session;
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed. Please sign in again.' },
        { status: 401 }
      );
    }
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    const { imageData, roomType, designStyle } = await request.json();

    if (!imageData || !roomType || !designStyle) {
      return NextResponse.json(
        { error: 'Missing required fields: imageData, roomType, designStyle' },
        { status: 400 }
      );
    }

    // Check and use credits
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const creditResult = await CreditService.useCredits(
      session.user.id,
      1,
      `AI design generation for ${roomType} in ${designStyle} style`
    );

    if (!creditResult.success) {
      return NextResponse.json(
        { error: creditResult.error || 'Failed to use credits' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service is not configured. Please add a valid GEMINI_API_KEY to your environment variables.' 
        },
        { status: 500 }
      );
    }

    // Initialize Google Gemini AI
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const model = 'gemini-2.0-flash-exp';
    
    // Create the prompt for interior design
    const prompt = `Transform this ${roomType.toLowerCase()} into a ${designStyle.toLowerCase()} interior design style. 
    Please redesign this room with the following requirements:
    - Apply ${designStyle.toLowerCase()} aesthetic throughout the room
    - Maintain the room's original layout and architectural features
    - Enhance the lighting, furniture, and decor to match the ${designStyle.toLowerCase()} style
    - Keep the same perspective and room structure
    - Return only the redesigned image without any text or explanations
    
    The image shows a ${roomType.toLowerCase()} that needs to be redesigned in ${designStyle.toLowerCase()} style.`;

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageData,
            },
          },
        ],
      },
    ];

    let generatedImageData: string | null = null;

    try {
      // Generate content using Gemini
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      // Collect the generated image
      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          continue;
        }
        
        const part = chunk.candidates[0].content.parts[0];
        if (part.inlineData && part.inlineData.data) {
          generatedImageData = part.inlineData.data;
          break; // We got the image, we can break
        }
      }
    } catch (apiError: unknown) {
      console.error('Gemini API Error:', apiError);
      
      // Check if it's a geographical restriction
      const error = apiError as { message?: string; error?: { message?: string } };
      if (error.message?.includes('not available in your country') || 
          error.error?.message?.includes('not available in your country')) {
        
        // Refund the credit since the API failed due to geographical restrictions
        await refundCredits(session.user.id, 'Refund due to geographical restrictions');
        
        // Return a clear error message for geographical restrictions
        return NextResponse.json(
          { 
            success: false, 
            error: 'AI image generation is not available in your region. This is a limitation of Google\'s Gemini API. Please try using a VPN connected to a supported region or check back later as Google expands availability.'
          },
          { status: 400 }
        );
      } else {
        // Re-throw other API errors
        throw apiError;
      }
    }

    if (!generatedImageData) {
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generatedImage: generatedImageData,
      prompt: prompt,
      remainingCredits: creditResult.newBalance,
    });

  } catch (error) {
    console.error('Error generating design:', error);
    
    // Handle specific Google API quota error
    let errorMessage = 'Failed to generate design. Please try again.';
    if (error && typeof error === 'object') {
      const errorObj = error as { error?: { message?: string } };
      if (errorObj.error?.message?.includes('quota') || errorObj.error?.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = 'AI service is currently unavailable due to high demand. Please try again later or check if you have reached your usage limit.';
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}