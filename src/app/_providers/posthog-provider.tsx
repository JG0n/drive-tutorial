// app/providers.tsx
"use client";

import { useEffect } from "react";

import dynamicLoader from "next/dynamic";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { env } from "~/env";

const SuspendedPostHogPageView = dynamicLoader(
	() => import("./pageview-tracker"),
	{ ssr: false },
);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: "/ingest",
			ui_host: "https://eu.posthog.com",
			person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
			capture_pageview: false, // Disable automatic pageview capture, as we capture manually
		});
	}, []);

	return (
		<PHProvider client={posthog}>
			<SuspendedPostHogPageView />
			{children}
		</PHProvider>
	);
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
//function SuspendedPostHogPageView() {
//	return (
//		<Suspense fallback={null}>
//			<PostHogPageView />
//		</Suspense>
//	);
//}
