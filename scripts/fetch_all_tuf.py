import urllib.request
import ssl
import json
import re
import os
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

with open('/tmp/fallbacks_68.json', 'r') as f:
    fallbacks = json.load(f)

# Load existing fetched results
fetched = {}
if os.path.exists('/tmp/tuf_fetched_results.json'):
    with open('/tmp/tuf_fetched_results.json', 'r') as f:
        fetched = json.load(f)

# Slug mapping overrides where sheet slug differs from TUF+ slug
SLUG_OVERRIDES = {
    'prob-1-1-2-cpp-basics': 'cpp',
    'prob-1-1-5-what-are-arrays-strings': 'sum-of-first-last-element-in-array',
    'prob-1-6-1-understand-recursion-by-p': 'print-x-n-numbers-of-times',
    'prob-1-6-2-print-name-n-times-using-': 'print-x-n-numbers-of-times',
    'prob-13-1-1-introduction-to-trees': 'introduction-',
    'prob-13-1-2-binary-tree-representatio': 'introduction-',
    'prob-15-1-2-graph-representation-c': 'introduction-to-graph',
    'prob-15-1-3-graph-representation-java': 'introduction-to-graph',
    'prob-16-2-4-maximum-sum-of-non-adjace': 'house-robber',
    'prob-16-9-1-maximum-rectangle-area-wi': 'maximum-rectangles',
    'prob-16-9-2-count-square-submatrices-': 'maximal-rectangle',
    'prob-18-1-5-z-function': 'z-function',
    'prob-18-1-7-shortest-palindrome': 'shortest-palindrome',
}

def clean_slug(plus_val):
    if not plus_val:
        return None
    return plus_val.replace('/plus/dsa/problems/', '').split('?')[0].strip('/')

def fetch_tuf(slug):
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
            try: full += json.loads('\"' + m + '\"')
            except: full += m
        
        idx_stmt = full.rfind('\"problem_statement\":')
        if idx_stmt == -1:
            return None
        idx_data = full.rfind('\"data\":', 0, idx_stmt)
        if idx_data == -1:
            return None
        start = full.find('{', idx_data)
        if start == -1:
            return None
        
        obj, _ = json.JSONDecoder().raw_decode(full[start:])
        if obj.get('problem_statement'):
            return obj
        return None
    except Exception as e:
        return None

print(f"Checking {len(fallbacks)} problems...")
success_count = 0
for idx, item in enumerate(fallbacks):
    pid = item['id']
    if pid in fetched and fetched[pid].get('statement') and not fetched[pid]['statement'].startswith('<p>You are given a problem'):
        print(f"[{idx+1}/{len(fallbacks)}] ALREADY FETCHED: {pid}")
        success_count += 1
        continue
    
    slug = SLUG_OVERRIDES.get(pid) or clean_slug(item.get('plus'))
    if not slug:
        print(f"[{idx+1}/{len(fallbacks)}] NO SLUG: {pid}")
        continue
    
    print(f"[{idx+1}/{len(fallbacks)}] Fetching {pid} ({slug})...", end='', flush=True)
    data = fetch_tuf(slug)
    if data:
        fetched[pid] = {
            'slug': slug,
            'name': data.get('problem_name') or item['title'],
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
        print(f" -> OK: {data.get('problem_name')}")
        success_count += 1
    else:
        print(" -> NOT FOUND")
    time.sleep(0.3)

with open('/tmp/tuf_fetched_results.json', 'w') as out:
    json.dump(fetched, out, indent=2)

print(f"\nFinal count fetched from TUF: {success_count} / {len(fallbacks)}")
