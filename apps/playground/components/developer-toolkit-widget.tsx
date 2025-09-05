"use client";

import { useRive } from "@rive-app/react-canvas";

export default function DeveloperToolkitWidget() {
  const { RiveComponent } = useRive({
    src: "https://storage.googleapis.com/eleven-public-cdn/marketing_website/assets/convai/dev_widget_animation.riv",
    autoplay: true,
  });

  return <RiveComponent className='h-full w-[65%]' />;
}