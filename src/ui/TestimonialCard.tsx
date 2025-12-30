import { Star } from "lucide-react";
import { Card, CardContent } from "./card";

export function TestimonialCard({
  testimonial,
  active,
}: {
  testimonial?: {
    name: string;
    role: string;
    image: string;
    text: string;
  };
  active: boolean;
}) {
  if (!testimonial) return null;

  return (
    <Card
  className={`border-0 rounded-3xl transform transition-all duration-1000 ease-out ${
    active
      ? "scale-105 shadow-xl bg-white"
      : "scale-100 bg-white/80 opacity-80"
  }`}
>
      <CardContent className="p-8 text-left space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-lg">
              {testimonial.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {testimonial.role}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          “{testimonial.text}”
        </p>
        <div className="flex gap-1 text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
            ))}
          </div>
      </CardContent>
    </Card>
  );
}
