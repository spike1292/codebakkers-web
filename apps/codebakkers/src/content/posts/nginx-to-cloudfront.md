---
title: "Killing the nginx tier: CloudFront + an SSR origin"
description: "Retiring a whole ECS/nginx layer in favour of CloudFront in front of a Node SSR origin — what moved, and what got simpler."
pubDate: 2026-07-13
tags: ["aws", "cloudfront", "edge", "angular"]
---

For years the request path ran through an nginx tier on ECS before it ever
reached the app. This week that tier came out.

## Why it existed, and why it didn't need to

nginx was doing three jobs: routing, a handful of redirects, and some header
rewriting. None of those need a always-on container fleet in 2026 — CloudFront
plus a small amount of edge logic covers all three, and the Node SSR origin
handles the rest.

## What moved where

- **Routing + caching** → CloudFront behaviours.
- **Redirects** → an edge key-value store, evaluated at the edge.
- **Header rewriting** → an edge function.

## What got simpler

One fewer tier to deploy, patch, and reason about — and one fewer place for a
container CVE to hide. The edge config is now declarative and lives with the
rest of the infrastructure-as-code.
