"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Home, Palette, Wand2, Users } from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Design Buddy
                </h1>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                Transform Your Space with AI-Powered Interior Design
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Upload a photo of your room, choose your style, and let our AI redesign your space. 
                Get professional interior design recommendations in seconds, not weeks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/design-studio">
                    <Wand2 className="h-5 w-5 mr-2" />
                    Start Designing
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/dashboard">
                    <Users className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Home className="h-5 w-5 mr-2" />
                View Demo
              </Button>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              ✨ 30 free credits when you sign up • No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">
                Redesign your space in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold">Upload Your Room</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an image of any room in your house
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-semibold">Choose Your Style</h3>
                <p className="text-muted-foreground">
                  Select from modern, coastal, industrial, and other design themes
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-xl font-semibold">Get AI Design</h3>
                <p className="text-muted-foreground">
                  Receive professional AI-generated redesigns instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Design Any Room</h2>
              <p className="text-xl text-muted-foreground">
                Transform every space in your home
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Living Room", icon: "🛋️" },
                { name: "Kitchen", icon: "🍳" },
                { name: "Bedroom", icon: "🛏️" },
                { name: "Bathroom", icon: "🚿" },
                { name: "Home Office", icon: "💼" },
                { name: "Dining Room", icon: "🍽️" },
                { name: "Nursery", icon: "👶" },
                { name: "Outdoor", icon: "🌳" },
              ].map((room) => (
                <div key={room.name} className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-2">{room.icon}</div>
                  <h3 className="font-medium">{room.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Styles Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Popular Design Styles</h2>
              <p className="text-xl text-muted-foreground">
                Find your perfect aesthetic
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Modern", description: "Clean lines and minimal clutter" },
                { name: "Coastal", description: "Light and airy beach-inspired" },
                { name: "Industrial", description: "Raw materials and urban edge" },
                { name: "Tropical", description: "Vibrant and nature-inspired" },
                { name: "Vintage", description: "Classic and timeless charm" },
                { name: "Neoclassical", description: "Elegant traditional design" },
              ].map((style) => (
                <div key={style.name} className="p-6 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold mb-2">{style.name}</h3>
                  <p className="text-muted-foreground text-sm">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of users who have redesigned their homes with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Link href="/design-studio">
                    <Wand2 className="h-5 w-5 mr-2" />
                    Start Designing
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Link href="/dashboard">
                    <Users className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
              )}
            </div>
            <p className="text-sm opacity-75">
              30 free credits • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
