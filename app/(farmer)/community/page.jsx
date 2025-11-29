"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Heart,
  MessageCircle,
  MapPin,
  Send,
  ImageIcon,
  X,
  Leaf,
  Flower2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommunityScreen() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Priya Singh",
      district: "Ludhiana",
      content:
        "Just completed my first composting quest! The results are amazing. Any tips for faster decomposition? 🌱",
      likes: 12,
      comments: 5,
      timestamp: "2 hours ago",
      avatar: "PS",
      images: ["/composting-pile-with-organic-waste.jpg"],
    },
    {
      id: 2,
      author: "Amit Verma",
      district: "Amritsar",
      content:
        "Water-saving tip: Try drip irrigation! Reduced my water usage by 40% this season. 💧",
      likes: 24,
      comments: 8,
      timestamp: "5 hours ago",
      avatar: "AV",
    },
    {
      id: 3,
      author: "Sunita Kaur",
      district: "Jalandhar",
      content:
        "Looking for organic pest control methods. What works best for tomatoes? 🍅",
      likes: 8,
      comments: 12,
      timestamp: "1 day ago",
      avatar: "SK",
      images: [
        "/tomato-plants-in-garden.jpg",
        "/organic-pest-control-spray.jpg",
      ],
    },
  ]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > 4) {
      alert("You can upload a maximum of 4 images");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      setPosts([
        {
          id: Date.now(),
          author: "Raj Kumar",
          district: "Patiala",
          content: newPost,
          likes: 0,
          comments: 0,
          timestamp: "Just now",
          avatar: "RK",
          images: uploadedImages.length > 0 ? uploadedImages : undefined,
        },
        ...posts,
      ]);
      setNewPost("");
      setUploadedImages([]);
      setShowPostModal(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-card border-[1.5px] border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] border-b-2 border-primary/20 p-4 watercolor-bg">
        <div className="flex items-center gap-4 max-w-2xl mx-auto relative">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className="text-2xl font-bold text-foreground flex items-center gap-2"
            style={{ fontFamily: "Mali, cursive" }}
          >
            <Flower2 className="w-6 h-6 text-accent" />
            Community Garden
          </h1>
          <div className="absolute -top-2 right-4 opacity-20">
            <Leaf className="w-8 h-8 text-primary animate-sway" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-5">
        <Button
          onClick={() => setShowPostModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-2xl h-12 text-base font-semibold"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Your Story 🌱
        </Button>

        {/* Posts Feed */}
        <div className="space-y-5">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity animate-grow"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-bold border-2 border-primary/20">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-semibold text-foreground"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  >
                    {post.author}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{post.district}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>
              <p className="text-foreground mb-4 leading-relaxed">
                {post.content}
              </p>

              {post.images && post.images.length > 0 && (
                <div
                  className={`grid gap-3 mb-4 ${
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-52 object-cover rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-colors"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-muted-foreground pt-3 border-t-2 border-dashed border-border">
                <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-primary group-hover:scale-110 transition-all" />
                  <span className="text-sm font-medium">{post.likes} 💚</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">
                    {post.comments} 💬
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPostModal && (
        <>
          <div
            className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-40"
            onClick={() => setShowPostModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] shadow-2xl z-50 max-h-[80vh] overflow-y-auto relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity soft-glow">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-primary" />
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Mali, cursive" }}
              >
                Share Your Story
              </h2>
            </div>
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your farming tips, questions, or experiences... 🌿"
              className="min-h-32 mb-4 rounded-2xl border-2 border-border focus:border-primary resize-none"
            />

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-2xl border-2 border-border"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  Add Photos ({uploadedImages.length}/4) 📸
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadedImages.length >= 4}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreatePost}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-2xl h-11"
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
              <Button
                onClick={() => {
                  setShowPostModal(false);
                  setUploadedImages([]);
                }}
                variant="outline"
                className="flex-1 rounded-2xl h-11 border-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
