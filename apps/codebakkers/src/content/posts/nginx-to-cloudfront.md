---
title: "Moving nginx work to the edge, one step at a time"
description: "How we moved redirects and the apps domains from nginx to CloudFront, what got simpler, and why the last nginx tier is next."
pubDate: 2026-07-13
tags: ["aws", "cloudfront", "edge", "angular"]
type: deep-dive
---

For years, requests passed through nginx on ECS before they reached the app.
We are moving that work to the edge in steps. The first steps are done. The
last nginx tier, in front of the main sites, is next.

## What moved already

- **Redirects** now live in an edge key-value store (CloudFront
  KeyValueStore). A CloudFront Function reads it at the edge.
- **The apps domains** are now served through CloudFront. Their nginx setup is
  gone.
- **The old cloud setup** is gone too. The sites run on a new cloud
  platform.

## What got simpler

Fewer containers to deploy, patch and keep in mind. A redirect is now a
key-value entry, not an nginx config change and a deploy. The edge config is
declarative and lives with the rest of the infrastructure-as-code.

## What is next

One nginx tier still sits in front of the main sites. It is the next step. The
approach stays the same: move one job at a time to the edge, check it, then
remove what is left.
