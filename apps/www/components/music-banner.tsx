"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const BANNER_DISMISSED_KEY = "music-banner-dismissed";

function ElevenMusicWordmark({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 275 33"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M-4.78538e-05 31.673V-1.9022e-07H6.60959V31.673H-4.78538e-05ZM13.0064 31.673V-1.9022e-07H19.6161V31.673H13.0064ZM26.0129 31.673V-1.9022e-07H45.5757V5.27884H32.6226V12.82H44.6885V18.0989H32.6226V26.3942H45.5757V31.673H26.0129ZM50.0516 31.673V-1.9022e-07H56.3063V31.673H50.0516ZM71.4362 32.2054C64.3386 32.2054 60.5236 28.4348 60.5236 19.7846C60.5236 11.1344 64.8265 7.40812 71.5249 7.40812C78.3563 7.40812 82.0382 11.09 82.0382 19.8733V21.1154H66.6897C66.9115 26.2611 68.4641 28.1686 71.4362 28.1686C73.7873 28.1686 75.2511 26.7934 75.5173 24.398H81.7721C81.3728 29.6325 77.0255 32.2054 71.4362 32.2054ZM66.734 17.3448H75.8722C75.5617 12.9975 74.0534 11.4005 71.4362 11.4005C68.8633 11.4005 67.1776 13.0418 66.734 17.3448ZM91.8785 31.673L84.1599 7.94044H90.5477L93.1206 16.9012C94.0965 20.1838 94.6732 22.8454 95.2055 25.7732H95.383C95.9153 22.8454 96.5363 20.1838 97.4679 16.9012L100.085 7.94044H106.473L98.7543 31.673H91.8785ZM118.676 32.2054C111.579 32.2054 107.764 28.4348 107.764 19.7846C107.764 11.1344 112.066 7.40812 118.765 7.40812C125.596 7.40812 129.278 11.09 129.278 19.8733V21.1154H113.93C114.151 26.2611 115.704 28.1686 118.676 28.1686C121.027 28.1686 122.491 26.7934 122.757 24.398H129.012C128.613 29.6325 124.265 32.2054 118.676 32.2054ZM113.974 17.3448H123.112C122.802 12.9975 121.293 11.4005 118.676 11.4005C116.103 11.4005 114.418 13.0418 113.974 17.3448ZM147.902 16.4132C147.902 13.3524 146.615 11.9328 144.353 11.9328C141.603 11.9328 139.828 13.9734 139.828 17.6996V31.673H133.573V11.8885L133.485 7.94044H139.695L139.828 11.0013H139.961C141.07 8.96072 143.466 7.40812 146.527 7.40812C151.051 7.40812 154.157 9.93664 154.157 15.4373V31.673H147.902V16.4132ZM162.629 31.673H158.637V-1.9022e-07H163.916L171.146 20.0507C172.211 22.9785 172.788 24.7972 173.631 27.725H173.808C174.651 24.7972 175.228 22.9785 176.292 20.0507L183.479 -1.9022e-07H188.802V31.673H184.809V14.2839C184.809 11.1787 184.854 9.27124 184.987 6.16604H184.809C184.055 8.78328 183.612 10.1141 182.414 13.4411L175.849 31.673H171.59L165.025 13.4411C163.783 10.1141 163.383 8.78328 162.585 6.16604H162.408C162.585 9.27124 162.629 11.1787 162.629 14.2839V31.673ZM215.254 7.94044V28.0355L215.343 31.673H211.439L211.35 27.9468H211.217C210.33 29.943 207.624 32.2054 203.587 32.2054C198.397 32.2054 195.336 28.9227 195.336 23.5995V7.94044H199.24V23.1116C199.24 26.7934 200.97 29.1445 204.563 29.1445C208.644 29.1445 211.35 26.0393 211.35 21.6477V7.94044H215.254ZM229.312 32.2054C223.279 32.2054 219.775 29.5881 219.553 24.5311H223.457C223.678 27.6363 225.852 29.2776 229.312 29.2776C232.861 29.2776 235.168 27.8137 235.168 25.3739C235.168 23.0228 233.571 22.2244 230.066 21.5146L227.893 21.071C222.836 20.0507 219.997 18.7199 219.997 14.2839C219.997 10.3802 223.811 7.40812 229.046 7.40812C234.192 7.40812 238.317 9.62612 238.495 14.4614H234.591C234.458 11.7554 231.974 10.3359 229.046 10.3359C226.207 10.3359 223.767 11.711 223.767 13.9734C223.767 16.147 225.275 16.9455 228.602 17.6553L230.776 18.0989C235.789 19.1192 238.938 20.2282 238.938 25.0634C238.938 29.0558 235.256 32.2054 229.312 32.2054ZM247.578 4.39164H243.319V-1.9022e-07H247.578V4.39164ZM247.401 31.673H243.497V7.94044H247.401V31.673ZM263.738 32.2054C256.463 32.2054 252.248 27.3701 252.248 19.7846C252.248 12.199 256.507 7.40812 263.738 7.40812C269.771 7.40812 273.497 10.5577 273.896 14.9937H269.992C269.371 12.1103 267.02 10.469 263.738 10.469C258.725 10.469 256.152 14.3726 256.152 19.7846C256.152 25.1965 258.681 29.1445 263.738 29.1445C266.932 29.1445 269.593 27.6806 270.17 24.398H274.073C273.275 29.5881 269.016 32.2054 263.738 32.2054Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function EqualizerBars() {
	return (
		<div className="flex items-end gap-[3px] h-[14px]" aria-hidden="true">
			{[0.6, 1, 0.4, 0.8, 0.5].map((scale, i) => (
				<div
					key={i}
					className="w-[2px] rounded-full bg-current"
					style={{
						animation: `music-eq ${0.8 + i * 0.15}s ease-in-out infinite alternate`,
						height: `${scale * 14}px`,
					}}
				/>
			))}
		</div>
	);
}

export function MusicBanner() {
	const [dismissed, setDismissed] = useState(true);
	const [isVisible, setIsVisible] = useState(false);
	const bannerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			const wasDismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
			if (!wasDismissed) {
				setDismissed(false);
				requestAnimationFrame(() => setIsVisible(true));
			}
		} catch {
			setDismissed(false);
			requestAnimationFrame(() => setIsVisible(true));
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		setTimeout(() => {
			setDismissed(true);
			try {
				localStorage.setItem(BANNER_DISMISSED_KEY, "1");
			} catch {}
		}, 300);
	};

	if (dismissed) return null;

	return (
		<div
			ref={bannerRef}
			className="relative z-[60] overflow-hidden transition-all duration-300 ease-out"
			style={{
				maxHeight: isVisible ? "60px" : "0px",
				opacity: isVisible ? 1 : 0,
			}}
		>
			{/* Dark background */}
			<div className="absolute inset-0 bg-[#0a0a0a]" />

			{/* Gradient blur orb — marketing-website style */}
			<div
				className="pointer-events-none absolute -top-1/2 left-1/2 h-[200%] w-full max-w-[900px] -translate-x-1/2"
				style={{
					borderRadius: "50%",
					background:
						"linear-gradient(90deg, #E56C61 0%, #CBB3CB 40%, #C38DC2 60%, #C8A9CC 80%)",
					filter: "blur(60px)",
					opacity: 0.15,
				}}
			/>

			{/* Subtle animated shimmer */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
					animation: "banner-shimmer 3s ease-in-out infinite",
				}}
			/>

			<Link
				href="https://elevenmusic.link/ui"
				target="_blank"
				rel="noopener noreferrer"
				className="group relative flex h-[40px] items-center justify-center gap-3 px-4 text-white/90 transition-colors hover:text-white"
			>
				<EqualizerBars />
				<span className="hidden items-center gap-2.5 sm:flex">
					<span className="text-[13px] font-medium tracking-wide text-white/60">
						Introducing
					</span>
					<ElevenMusicWordmark className="h-[11px] w-auto" />
				</span>
				<span className="flex items-center gap-2 sm:hidden">
					<span className="text-[13px] font-medium tracking-wide text-white/60">
						Introducing
					</span>
					<ElevenMusicWordmark className="h-[10px] w-auto" />
				</span>
				<span className="flex items-center gap-1 text-[13px] font-medium text-white/50 transition-colors group-hover:text-white/80">
					<span className="hidden lg:inline">Try it now</span>
					<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
				</span>
			</Link>

			{/* Close button */}
			<button
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleDismiss();
				}}
				className="absolute right-2 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/30 transition-colors hover:text-white/60"
				aria-label="Dismiss banner"
			>
				<X className="size-3.5" />
			</button>
		</div>
	);
}
