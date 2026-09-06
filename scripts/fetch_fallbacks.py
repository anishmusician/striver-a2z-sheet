import urllib.request
import ssl
import json
import re
import os
import concurrent.futures

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

with open('/tmp/fallbacks_68.json', 'r') as f:
    fallbacks = json.load(f)

def clean_slug(plus_val):
    if not plus_val:
        return None
    return plus_val.replace('/plus/dsa/problems/', '').split('?')[0].strip('/')

def fetch_tuf_data(slug):
    if not slug:
        return None
    url = f'https://takeuforward.org/plus/dsa/problems/{slug}'
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        push_matches = re.findall(r'self\.__next_f\.push\(\[1,\s*\"(.*?)\"\s*\]\)', html, re.DOTALL)
        full = ''
        for m in push_matches:
            try:
                full += json.loads('\"' + m + '\"')
            except:
                full += m
        
        target = f'\"problemSlug\":\"{slug}\",\"data\":'
        idx = full.find(target)
        if idx == -1:
            # Try searching for problem_statement
            idx2 = full.find('\"problem_statement\":')
            if idx2 == -1:
                return None
            idx = full.rfind('\"data\":', 0, idx2)
            if idx == -1:
                return None
            start = idx + len('\"data\":')
        else:
            start = idx + len(target)
        
        depth = 0
        end = -1
        for i in range(start, len(full)):
            if full[i] == '{': depth += 1
            elif full[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end != -1:
            obj = json.loads(full[start:end])
            if obj.get('problem_statement'):
                return obj
        return None
    except Exception as e:
        return None

results = {}

def process_item(item):
    slug = clean_slug(item.get('plus'))
    if slug:
        data = fetch_tuf_data(slug)
        if data:
            return item['id'], slug, data
    return item['id'], slug, None

print(f"Starting fetch for {len(fallbacks)} fallbacks...")
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(process_item, item) for item in fallbacks]
    for future in concurrent.futures.as_completed(futures):
        pid, slug, data = future.result()
        if data:
            results[pid] = {
                'slug': slug,
                'name': data.get('problem_name'),
                'statement': data.get('problem_statement'),
                'example1': data.get('example1'),
                'example2': data.get('example2'),
                'example3': data.get('example3'),
                'constraints': data.get('constraints'),
                'hints': [h.get('hint') for h in data.get('hints', []) if isinstance(h, dict) and h.get('hint') and 'Subscribe' not in h.get('hint', '')],
                'testcases': data.get('testcases', []),
                'starters': {
                    'cpp': data.get('publicCpp'),
                    'java': data.get('publicJava'),
                    'python': data.get('publicPy'),
                    'javascript': data.get('publicJs'),
                }
            }
            print(f" [FETCHED] {pid} ({slug}) -> {data.get('problem_name')}")
        else:
            print(f" [MISSED] {pid} ({slug})")

print(f"\nFetched {len(results)} out of {len(fallbacks)} from TUF live!")
with open('/tmp/tuf_fetched_results.json', 'w') as out:
    json.dump(results, out, indent=2)
