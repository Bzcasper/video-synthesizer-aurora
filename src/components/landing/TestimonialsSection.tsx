import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Content Creator",
    quote:
      "Aurora Video Synth has revolutionized my content creation workflow. I can now produce high-quality videos in minutes instead of hours.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    quote:
      "The AI capabilities are mind-blowing. We've increased our video content output by 300% while maintaining consistent brand quality.",
    rating: 5,
  },
  {
    name: "Michael Park",
    role: "YouTuber",
    quote:
      "Game-changing platform for creators. The multilingual dubbing feature helped me reach a global audience effortlessly.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Loved by Creators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-panel p-6 hover-glow transition-all duration-300 animate-fade-in flex flex-col justify-between"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">
                  "{testimonial.quote}"
                </p>
              </div>
              <div>
                <p className="text-gray-100 font-semibold">
                  {testimonial.name}
                </p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
