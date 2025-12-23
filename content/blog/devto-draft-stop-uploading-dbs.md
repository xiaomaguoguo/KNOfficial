---
title: Stop uploading your DBs! View SQLite files 100% locally with WASM
description: I didn't trust online SQLite viewers, so I built an Offline one using Nuxt 3 and WebAssembly.
date: 2025-12-23
image: /images/sqlite-viewer-cover.png
tags: [sqlite, wasm, nuxt, privacy, offline]
---

# 🛑 Stop uploading your DBs! View SQLite files 100% locally with WASM

## The Problem: "Please upload your .db file" ... Ummm, No. 🙅‍♂️

Last week, I needed to debug a strange issue with a user's local SQLite database. They sent me the `.db` file (with permission, of course). I just needed to run a quick `SELECT * FROM users WHERE id=...` to check a flag.

I didn't want to spin up a whole DBeaver instance or write a Python script just for a 30-second check. So, like any lazy developer, I Googled **"Online SQLite Viewer"**.

The results? A minefield. 💣

> *"Upload your file to view it!"*
> *"Server processing..."*
> *"Wait for upload..."*

**Absolutely not.**

This was production data. I am not uploading a user's database to some random server in who-knows-where. Even if they promise "we delete it after," I can't take that risk.

I realized there was a gap. Why does viewing a local file require a server round-trip in 2025? Browsers are powerful enough to run Doom; surely they can read a SQLite file?

## The Tech Stack: WebAssembly to the Rescue 🦸‍♂️

I decided to build my own. No servers. No uploads. Just pure client-side power.

Here is the stack I chose:

*   **⚡ Nuxt 3**: For that sweet, sweet Developer Experience (DX) and auto-imports.
*   **🎨 Tailwind CSS**: Because I want it to look good without fighting CSS.
*   **🦀 `sqlite-wasm`**: The magic sauce. This is the official WebAssembly build of SQLite. It allows us to run a full SQLite engine *inside* the browser tab.

## The Solution: KNothing SQLite Viewer 🛠️

After a weekend of coding and caffeinating, I deployed **[KNothing SQLite Viewer](https://knothing.com/sqlite-viewer)**.

Here is why it's different:

### 1. It runs in your RAM 🧠
When you "open" a file, it's not verified or sent anywhere. The browser reads the file buffer and passes it directly to the WASM instance in memory. If you open the Network tab in DevTools, you will see **zero** requests sending your DB file.

### 2. It pulls the plug on the internet 🔌
Don't believe me? Load the page, then **turn off your Wi-Fi**.
Now try to open a file and run a query. **It still works.**
It's a PWA (Progressive Web App), so it's fully functional offline.

### 3. Full SQL Power ⚡
It's not just a read-only list. You can run:
```sql
SELECT * FROM orders 
WHERE total > 100 
ORDER BY created_at DESC;
```
It supports whatever the standard SQLite engine supports.

## Try it out! 🚀

I made this tool free and open for everyone. No ads, no tracking, no nonsense.

👉 **[Try the Offline SQLite Viewer](https://knothing.com/sqlite-viewer)**

It's open source-ish (I'm cleaning up the repo to share soon).

Let me know what you think! Does it handle your 1GB+ files? (It depends on your RAM, but I've tested it up to 500MB comfortably).

Happy (Secure) Coding! 🔒
