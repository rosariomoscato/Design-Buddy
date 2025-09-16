"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Upload, Palette, Download, Sparkles, Coins, Loader2 } from "lucide-react";
import Link from "next/link";

const ROOM_TYPES = [
  "Living Room",
  "Kitchen", 
  "Bedroom",
  "Bathroom",
  "Home Office",
  "Dining Room",
  "Nursery",
  "Outdoor"
];

const DESIGN_STYLES = [
  "Modern",
  "Coastal",
  "Professional", 
  "Tropical",
  "Vintage",
  "Industrial",
  "Neoclassical",
  "Tribal"
];

export default function DesignStudioPage() {
  const { data: session, isPending } = useSession();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(30);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  // Fetch user credits on component mount
  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session]);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      const result = await response.json();
      if (result.success) {
        setUserCredits(result.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedRoomType || !selectedStyle) {
      alert("Please upload an image and select both room type and design style.");
      return;
    }

    if (userCredits < 1) {
      alert("Insufficient credits. Please upgrade to continue.");
      return;
    }

    setIsGenerating(true);
    try {
      // Extract base64 data from the uploaded image
      const base64Data = uploadedImage.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          roomType: selectedRoomType,
          designStyle: selectedStyle,
        }),
      });

      console.log('Fetch Response Status:', response.status);
      console.log('Fetch Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error Response:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      console.log('API Response Status:', response.status);
      console.log('API Response:', result);
      console.log('API Response success:', result.success);
      console.log('API Response error:', result.error);

      if (!result.success) {
        throw new Error(result.error ?? 'Failed to generate design');
      }

      // Convert base64 to data URL
      const generatedImageDataUrl = `data:image/jpeg;base64,${result.generatedImage}`;
      setGeneratedImage(generatedImageDataUrl);
      setUserCredits(result.remainingCredits);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `design-buddy-${selectedRoomType.toLowerCase()}-${selectedStyle.toLowerCase()}.jpg`;
      link.click();
    }
  };

  const handleNewDesign = () => {
    setUploadedImage(null);
    setSelectedRoomType("");
    setSelectedStyle("");
    setGeneratedImage(null);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Welcome to Design Studio</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the AI design studio
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl relative">
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-8 shadow-xl max-w-sm mx-4 border">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Generating Your Design</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is transforming your {selectedRoomType} with {selectedStyle} style...
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Design Studio</h1>
          <p className="text-muted-foreground">Transform your space with AI-powered interior design</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Coins className="w-4 h-4" />
            {isLoadingCredits ? 'Loading...' : `${userCredits} credits`}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Welcome, {session.user.name}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Upload and Settings */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Room Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <span className="text-lg font-medium">Drop your image here</span>
                    <span className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG up to 10MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded room"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Room Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedRoomType(type)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedRoomType === type
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Design Style Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Design Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedStyle === style
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!uploadedImage || !selectedRoomType || !selectedStyle || isGenerating || userCredits < 1}
            className="w-full text-lg py-6"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? "Generating..." : "Generate Design (1 credit)"}
          </Button>

          {userCredits < 1 && (
            <div className="text-center text-sm text-red-600">
              Insufficient credits. Please upgrade to continue.
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Design Result</CardTitle>
            </CardHeader>
            <CardContent>
              {!generatedImage ? (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    Your AI-generated design will appear here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload an image and click &quot;Generate Design&quot; to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="AI generated design"
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      AI Generated
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleNewDesign} variant="outline" className="flex-1">
                      New Design
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Room:</strong> {selectedRoomType}</p>
                    <p><strong>Style:</strong> {selectedStyle}</p>
                    <p><strong>Credits used:</strong> 1</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Coins className="w-4 h-4 mr-2" />
                Buy More Credits
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Saved Designs
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}