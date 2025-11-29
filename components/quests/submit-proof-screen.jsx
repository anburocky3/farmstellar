"use client"

import { ChevronLeft, MessageSquare, CheckCircle2, X, Camera } from "lucide-react"
import { useState, useRef } from "react"

export function SubmitProofScreen({ quest, onSubmit, onBack }) {
  const [notes, setNotes] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const showPhotoOption = quest.id !== "crops"

  const canSubmit = uploadedImage !== null

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      setUploadedImage(imageData)
      stopCamera()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit()
  }

  return (
    <div className="flex flex-col h-screen pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Submit Proof</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6 pb-32">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Show Your Work</h2>
          <p className="text-sm text-muted-foreground">Submit evidence of quest completion</p>
        </div>

        {/* Upload Options */}
        {showPhotoOption && (
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">Upload Media</h3>

            {/* Camera View */}
            {isCameraActive ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-2xl border-2 border-primary"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:scale-110 transition-transform font-bold flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full shadow-lg hover:scale-110 transition-transform font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded proof"
                  className="w-full h-64 object-cover rounded-2xl border-2 border-primary"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Photo Ready!
                </div>
              </div>
            ) : (
              <button
                onClick={startCamera}
                className="w-full border-2 border-dashed border-primary bg-primary/5 rounded-xl p-6 hover:bg-primary/10 transition-all text-center"
              >
                <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-bold text-primary">Open Live Camera 📷</p>
                <p className="text-xs text-muted-foreground mt-1">Take photo in real-time</p>
              </button>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-3">
          <h3 className="font-bold text-foreground text-sm">Additional Notes</h3>
          <div className="relative">
            <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any challenges, discoveries, or insights from this quest..."
              className="w-full pl-10 pt-3 pr-4 pb-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Submit Button - Fixed at bottom for thumb reach */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-background via-background to-transparent border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${canSubmit && !isSubmitting
            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Submitting...
            </span>
          ) : (
            "Submit for Review ✓"
          )}
        </button>
      </div>
    </div>
  )
}
